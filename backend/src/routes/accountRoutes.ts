import { Router } from "express";
import * as accountController from "../controllers/accountController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.delete("/", asyncHandler(accountController.deleteAccount));

export default router;
