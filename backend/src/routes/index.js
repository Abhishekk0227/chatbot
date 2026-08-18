import { Router } from "express";
import healthRouter from "./health.js";
import formsRouter from "./forms.js";
import authRouter from "./auth.js";
import chatRouter from "./chat.route.js";

const router = Router();

router.use(healthRouter);
router.use("/forms", formsRouter);
router.use("/auth", authRouter);
router.use(chatRouter);

export default router;
