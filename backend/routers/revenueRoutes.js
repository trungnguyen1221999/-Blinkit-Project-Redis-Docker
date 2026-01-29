import express from "express";
import { 
  getRevenue,
  getRealtimeRevenue,
  manualRevenueEvent
} from '../controllers/revenueController.js';

const router = express.Router();

// GET /api/revenue?type=day|month|year OR ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/", getRevenue);

// Redis Pub/Sub Routes
router.get("/realtime", getRealtimeRevenue);           // Get real-time revenue stats
router.post("/manual-event", manualRevenueEvent);     // Manual event for testing

export default router;
