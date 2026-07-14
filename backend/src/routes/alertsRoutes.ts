import { Router } from "express";
import * as alertsController from "../controllers/alertsController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/check", asyncHandler(alertsController.checkAlerts));

router.use(requireAuth);

router.post("/", asyncHandler(alertsController.createAlert));
router.delete("/:id", asyncHandler(alertsController.removeAlert));
router.get("/", asyncHandler(alertsController.getUserAlerts));

export default router;
