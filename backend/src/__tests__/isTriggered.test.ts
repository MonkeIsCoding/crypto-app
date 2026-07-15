jest.mock("../config/firebase");

import { isTriggered } from "../services/alertsService";
import { Alert } from "../types";

function makeAlert(overrides: Partial<Alert>): Alert {
  return {
    id: "alert-1",
    user_id: "user-1",
    coin_id: "bitcoin",
    type: "above",
    target_price: 100,
    triggered: false,
    created_at: "2026-07-15T00:00:00.000Z",
    ...overrides,
  };
}

describe("isTriggered", () => {
  describe("above", () => {
    const alert = makeAlert({ type: "above", target_price: 100 });

    it("triggers when the price is above the target", () => {
      expect(isTriggered(alert, 120)).toBe(true);
    });

    it("triggers when the price equals the target (inclusive)", () => {
      expect(isTriggered(alert, 100)).toBe(true);
    });

    it("does not trigger when the price is below the target", () => {
      expect(isTriggered(alert, 80)).toBe(false);
    });
  });

  describe("below", () => {
    const alert = makeAlert({ type: "below", target_price: 100 });

    it("triggers when the price is below the target", () => {
      expect(isTriggered(alert, 80)).toBe(true);
    });

    it("triggers when the price equals the target (inclusive)", () => {
      expect(isTriggered(alert, 100)).toBe(true);
    });

    it("does not trigger when the price is above the target", () => {
      expect(isTriggered(alert, 120)).toBe(false);
    });
  });
});
