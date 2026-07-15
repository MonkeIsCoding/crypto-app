jest.mock("../config/firebase");
jest.mock("firebase-admin/auth");

import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { requireAuth } from "../middleware/auth";

const mockedGetAuth = getAuth as jest.Mock;

function makeRes(): Response {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

function setVerifyIdToken(impl: (token: string) => Promise<{ uid: string }>) {
  mockedGetAuth.mockReturnValue({ verifyIdToken: jest.fn(impl) });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("requireAuth", () => {
  it("responds 401 and does not call next when the header is missing", async () => {
    const req = { headers: {} } as Request;
    const res = makeRes();
    const next = jest.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds 401 when the token is invalid or expired", async () => {
    setVerifyIdToken(() => Promise.reject(new Error("invalid token")));
    const req = { headers: { authorization: "Bearer bad-token" } } as Request;
    const res = makeRes();
    const next = jest.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets req.uid and calls next when the token is valid", async () => {
    setVerifyIdToken(() => Promise.resolve({ uid: "user-123" }));
    const req = { headers: { authorization: "Bearer good-token" } } as Request;
    const res = makeRes();
    const next = jest.fn() as NextFunction;

    await requireAuth(req, res, next);

    expect(req.uid).toBe("user-123");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
