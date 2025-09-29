import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

router
    .route('/')
    .get(getAllProjects)
    .post(createProject);

router
    .route('/:id')
    .get(getProjectById)
    .patch(updateProject)
    .delete(deleteProject);

export default router;