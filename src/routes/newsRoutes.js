import express from 'express';
import {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews
} from '../controllers/newsController.js';

const router = express.Router();

router
    .route('/')
    .get(getAllNews)
    .post(createNews);

router
    .route('/:id')
    .get(getNewsById)
    .patch(updateNews)
    .delete(deleteNews);

export default router;