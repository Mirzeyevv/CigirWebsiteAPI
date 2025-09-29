// routes/projectCategoryRoutes.js
import express from 'express';
import {
    createProjectCategory,
    getAllProjectCategories,
    getProjectCategoryById,
    updateProjectCategory,
    deleteProjectCategory
} from '../controllers/projectCategoryController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// Görmək (GET) public, yaratmaq (POST) qorunur
router.route('/')
    .get(getAllProjectCategories)
    .post(protect, createProjectCategory);

// Tək birini görmək (GET) public, yeniləmək (PATCH) və silmək (DELETE) qorunur
router.route('/:id')
    .get(getProjectCategoryById)
    .patch(protect, updateProjectCategory)
    .delete(protect, deleteProjectCategory);

export default router;