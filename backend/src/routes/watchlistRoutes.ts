import { Router } from "express";
import * as watchlistController from "../controllers/watchlistController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(watchlistController.addToWatchlist));
router.delete("/:id", asyncHandler(watchlistController.removeFromWatchlist));
router.get("/:userId", asyncHandler(watchlistController.getWatchlist));

export default router;
