// src/routes/recycleBinRoutes.js
import express from 'express';
import { getDeletedItems, restoreItem } from '../controllers/recycleBinController.js';
import { protect, isAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// Bu endpoint-lərə yalnız adminlər daxil ola bilər
router.route('/')
    .get(protect, isAdmin, getDeletedItems);

router.route('/restore')
    .post(protect, isAdmin, restoreItem);

export default router;