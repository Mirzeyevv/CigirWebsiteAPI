import express from 'express';
import {
    createNews,
    getAllNews,
    getNewsById,
    getNewsBySlug, // <-- YENİ FUNKSİYANİ İMPORT ET
    updateNews,
    deleteNews
} from '../controllers/newsController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// PUBLİK SAYT ÜÇÜN YENİ ROUTE
// Bu, admin route-larından əvvəl olmalıdır ki, "slug" sözü ID kimi qəbul edilməsin
router.get('/slug/:slug', getNewsBySlug);


// ADMIN PANELİ ÜÇÜN ROUTE-LAR
router.route('/')
    .get(getAllNews)
    .post(protect, createNews);

router.route('/:id')
    .get(getNewsById) // Admin panelində redaktə üçün xəbəri ID ilə tapmaq daha etibarlıdır
    .patch(protect, updateNews)
    .delete(protect, deleteNews);

export default router;