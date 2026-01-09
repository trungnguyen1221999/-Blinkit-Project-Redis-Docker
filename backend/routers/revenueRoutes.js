import express from "express";
import { getRevenue } from "../controllers/revenueController.js";

const router = express.Router();

// GET /api/revenue?type=day|month|year OR ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/", getRevenue);

export default router;
