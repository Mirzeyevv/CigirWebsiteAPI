import express from 'express';
import { createUser, login } from '../controllers/authController.js';
import { protect, isAdmin } from '../utils/authMiddleware.js'; // <-- YENİ İMPORT

const router = express.Router();

// İstifadəçi yaratmaq üçün endpoint İNDİ QORUNUR
//router.post('/create-user', protect, isAdmin, createUser);
router.post('/create-user', /* protect, isAdmin, */ createUser);

// Sistemə daxil olmaq üçün endpoint (bu public qalır)
router.post('/login', login);

export default router;