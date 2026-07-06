import { Router } from "express";
import * as coinsController from "../controllers/coinsController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(coinsController.listCoins));
router.get("/:id", asyncHandler(coinsController.getCoin));

export default router;
