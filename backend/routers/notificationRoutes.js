import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// GET /api/notifications - Lấy tất cả notifications
router.get('/', getNotifications);

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', markAsRead);

export default router;