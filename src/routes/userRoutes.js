// routes/userRoutes.js
import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
import { protect, isAdmin } from '../utils/authMiddleware.js';

const router = express.Router();

// Bütün istifadəçi əməliyyatları yalnız adminlər üçün
router.use(protect, isAdmin);

router.route('/')
    .get(getAllUsers);

router.route('/:id')
    .delete(deleteUser);

export default router;