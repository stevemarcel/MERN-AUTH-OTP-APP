import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// * 1. Send contact message
// POST /api/contact
router.post("/", sendContactMessage);

export default router;
