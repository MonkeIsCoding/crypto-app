import { Router } from "express";
import * as watchlistController from "../controllers/watchlistController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", asyncHandler(watchlistController.addToWatchlist));
router.delete("/:id", asyncHandler(watchlistController.removeFromWatchlist));
router.get("/", asyncHandler(watchlistController.getWatchlist));

export default router;
