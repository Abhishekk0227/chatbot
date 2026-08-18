import { Router } from "express";
import { handleUserChat } from "../controllers/chat.controller.js";

const router = Router();

router.post("/chat", handleUserChat);

export default router;
