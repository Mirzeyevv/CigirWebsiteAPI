import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/newsCategoryController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// Görmək (GET) public, yaratmaq (POST) qorunur
router.route('/')
    .get(getAllCategories)
    .post(protect, createCategory);

// Tək birini görmək (GET) public, yeniləmək (PATCH) və silmək (DELETE) qorunur
router.route('/:id')
    .get(getCategoryById)
    .patch(protect, updateCategory)
    .delete(protect, deleteCategory);

export default router;