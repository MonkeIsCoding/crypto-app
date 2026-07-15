jest.mock("../config/firebase");
jest.mock("firebase-admin/auth");
jest.mock("../repositories/watchlistRepository");
jest.mock("../repositories/coinsRepository");

import request from "supertest";
import { getAuth } from "firebase-admin/auth";
import * as watchlistRepository from "../repositories/watchlistRepository";
import * as coinsRepository from "../repositories/coinsRepository";
import { createApp } from "../app";
import { WatchlistEntry } from "../types";

const mockedGetAuth = getAuth as jest.Mock;
const mockedWatchlist = watchlistRepository as jest.Mocked<typeof watchlistRepository>;
const mockedCoins = coinsRepository as jest.Mocked<typeof coinsRepository>;

// In-memory stand-in for the Firestore-backed watchlist collection, so the
// route/controller/service wiring is exercised for real while nothing hits
// an actual database.
const store: WatchlistEntry[] = [];

beforeEach(() => {
  jest.clearAllMocks();
  store.length = 0;

  mockedGetAuth.mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: "user-1" }),
  });

  mockedWatchlist.addToWatchlist.mockImplementation(async (userId, coinId) => {
    const entry: WatchlistEntry = {
      id: `${userId}_${coinId}`,
      user_id: userId,
      coin_id: coinId,
      added_at: new Date().toISOString(),
    };
    if (!store.some((e) => e.id === entry.id)) store.push(entry);
    return entry;
  });
  mockedWatchlist.getWatchlistByUser.mockImplementation(async (userId) =>
    store.filter((e) => e.user_id === userId)
  );
  mockedCoins.getCoinsByIds.mockResolvedValue(new Map());
});

describe("watchlist round-trip", () => {
  it("adds a coin via POST and returns it on GET", async () => {
    const app = createApp();

    const postRes = await request(app)
      .post("/watchlist")
      .set("Authorization", "Bearer test-token")
      .send({ coinId: "bitcoin" });

    expect(postRes.status).toBe(201);
    expect(postRes.body.coin_id).toBe("bitcoin");

    const getRes = await request(app).get("/watchlist").set("Authorization", "Bearer test-token");

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveLength(1);
    expect(getRes.body[0].coin_id).toBe("bitcoin");
  });

  it("rejects an unauthenticated request with 401", async () => {
    const app = createApp();

    const res = await request(app).get("/watchlist");

    expect(res.status).toBe(401);
  });
});
