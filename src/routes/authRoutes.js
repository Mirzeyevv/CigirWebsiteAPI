// routes/authRoutes.js

import express from 'express';
import { createUser, login, logout } from '../controllers/authController.js';
// Middleware importu gələcəkdə lazım olacaq, qala bilər
import { protect, isAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// Sistemə daxil olmaq üçün endpoint (public)
router.post('/login', login);
router.post('/logout', protect, logout);

// Yeni istifadəçi yaratmaq üçün endpoint (hələlik public)
// Gələcəkdə admin qoruması əlavə etmək üçün middleware-i aktivləşdirəcəyik
router.post('/create-user', createUser);


export default router;