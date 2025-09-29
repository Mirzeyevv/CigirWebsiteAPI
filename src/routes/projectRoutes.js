import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// Görmək (GET) public, yaratmaq (POST) qorunur
router.route('/')
    .get(getAllProjects)
    .post(protect, createProject);

// Tək birini görmək (GET) public, yeniləmək (PATCH) və silmək (DELETE) qorunur
router.route('/:id')
    .get(getProjectById)
    .patch(protect, updateProject)
    .delete(protect, deleteProject);

export default router;