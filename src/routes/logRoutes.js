// src/routes/logRoutes.js
import express from 'express';
import { getAllLogs } from '../controllers/logController.js';
import { protect, isAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// Logları görmək üçün yalnız admin icazəsi olmalıdır
router.route('/').get(protect, isAdmin, getAllLogs);

export default router;