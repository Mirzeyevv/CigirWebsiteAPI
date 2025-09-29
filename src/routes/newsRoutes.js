// routes/newsRoutes.js
import express from 'express';
import {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews
} from '../controllers/newsController.js';

import { protect } from '../utils/authMiddleware.js'; // Yalnız "protect" istifadə edirik

const router = express.Router();

router
    .route('/')
    .get(getAllNews)
    .post(protect, createNews); 

router
    .route('/:id')
    .get(getNewsById)
    .patch(protect, updateNews) 
    .delete(protect, deleteNews); 

export default router;