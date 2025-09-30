// routes/projectRoutes.js
import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectBySlug, // <-- YENİ İMPORT
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// PUBLİK SAYT ÜÇÜN YENİ ROUTE
router.get('/slug/:slug', getProjectBySlug);

// ADMIN PANELİ VƏ ÜMUMİ ROUTE-LAR
router.route('/')
    .get(getAllProjects)
    .post(protect, createProject);

router.route('/:id')
    .get(getProjectById)
    .patch(protect, updateProject)
    .delete(protect, deleteProject);

export default router;