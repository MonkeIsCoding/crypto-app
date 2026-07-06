import { Router } from "express";
import * as alertsController from "../controllers/alertsController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Note: /check must be registered before /:userId to avoid being shadowed.
router.get("/check", asyncHandler(alertsController.checkAlerts));
router.post("/", asyncHandler(alertsController.createAlert));
router.delete("/:id", asyncHandler(alertsController.removeAlert));
router.get("/:userId", asyncHandler(alertsController.getUserAlerts));

export default router;
