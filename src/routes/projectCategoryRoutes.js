import express from 'express';
import {
    createProjectCategory,
    getAllProjectCategories,
    getProjectCategoryById,
    updateProjectCategory,
    deleteProjectCategory
} from '../controllers/projectCategoryController.js';

const router = express.Router();

router
    .route('/')
    .get(getAllProjectCategories)
    .post(createProjectCategory);

router
    .route('/:id')
    .get(getProjectCategoryById)
    .patch(updateProjectCategory)
    .delete(deleteProjectCategory);

export default router;