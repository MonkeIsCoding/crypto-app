jest.mock("../config/firebase", () => ({ db: {} }));
jest.mock("../repositories/watchlistRepository");
jest.mock("../repositories/alertsRepository");

import * as watchlistRepository from "../repositories/watchlistRepository";
import * as alertsRepository from "../repositories/alertsRepository";
import { removeCoinIfOwner } from "../services/watchlistService";
import { removeAlertIfOwner } from "../services/alertsService";
import { Alert, WatchlistEntry } from "../types";

const mockedWatchlist = watchlistRepository as jest.Mocked<typeof watchlistRepository>;
const mockedAlerts = alertsRepository as jest.Mocked<typeof alertsRepository>;

function makeWatchlistEntry(userId: string): WatchlistEntry {
  return { id: "entry-1", user_id: userId, coin_id: "bitcoin", added_at: "2026-07-15T00:00:00.000Z" };
}

function makeAlert(userId: string): Alert {
  return {
    id: "alert-1",
    user_id: userId,
    coin_id: "bitcoin",
    type: "above",
    target_price: 100,
    triggered: false,
    created_at: "2026-07-15T00:00:00.000Z",
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("removeCoinIfOwner", () => {
  it("deletes and returns true when the caller owns the entry", async () => {
    mockedWatchlist.getWatchlistEntryById.mockResolvedValue(makeWatchlistEntry("user-1"));

    const result = await removeCoinIfOwner("entry-1", "user-1");

    expect(result).toBe(true);
    expect(mockedWatchlist.removeFromWatchlist).toHaveBeenCalledWith("entry-1");
  });

  it("returns false and does not delete when the caller is not the owner", async () => {
    mockedWatchlist.getWatchlistEntryById.mockResolvedValue(makeWatchlistEntry("someone-else"));

    const result = await removeCoinIfOwner("entry-1", "user-1");

    expect(result).toBe(false);
    expect(mockedWatchlist.removeFromWatchlist).not.toHaveBeenCalled();
  });

  it("returns false when the entry does not exist", async () => {
    mockedWatchlist.getWatchlistEntryById.mockResolvedValue(null);

    const result = await removeCoinIfOwner("missing", "user-1");

    expect(result).toBe(false);
    expect(mockedWatchlist.removeFromWatchlist).not.toHaveBeenCalled();
  });
});

describe("removeAlertIfOwner", () => {
  it("deletes and returns true when the caller owns the alert", async () => {
    mockedAlerts.getAlertById.mockResolvedValue(makeAlert("user-1"));

    const result = await removeAlertIfOwner("alert-1", "user-1");

    expect(result).toBe(true);
    expect(mockedAlerts.removeAlert).toHaveBeenCalledWith("alert-1");
  });

  it("returns false and does not delete when the caller is not the owner", async () => {
    mockedAlerts.getAlertById.mockResolvedValue(makeAlert("someone-else"));

    const result = await removeAlertIfOwner("alert-1", "user-1");

    expect(result).toBe(false);
    expect(mockedAlerts.removeAlert).not.toHaveBeenCalled();
  });

  it("returns false when the alert does not exist", async () => {
    mockedAlerts.getAlertById.mockResolvedValue(null);

    const result = await removeAlertIfOwner("missing", "user-1");

    expect(result).toBe(false);
    expect(mockedAlerts.removeAlert).not.toHaveBeenCalled();
  });
});
