// routes/newsCategoryRoutes.js
import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/newsCategoryController.js';
import { protect } from '../utils/authMiddleware.js'; // Yalnız "protect" istifadə edirik

const router = express.Router();

router.route('/')
    .get(getAllCategories)
    .post(protect, createCategory); // <-- isAdmin çıxarıldı

router.route('/:id')
    .get(getCategoryById)
    .patch(protect, updateCategory) // <-- isAdmin çıxarıldı
    .delete(protect, deleteCategory); // <-- isAdmin çıxarıldı

export default router;