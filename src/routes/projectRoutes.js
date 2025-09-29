// routes/projectRoutes.js
import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import { protect } from '../utils/authMiddleware.js'; // Yalnız "protect" istifadə edirik

const router = express.Router();

router.route('/')
    .get(getAllProjects)
    .post(protect, createProject); // <-- isAdmin çıxarıldı

router.route('/:id')
    .get(getProjectById)
    .patch(protect, updateProject) // <-- isAdmin çıxarıldı
    .delete(protect, deleteProject); // <-- isAdmin çıxarıldı

export default router;