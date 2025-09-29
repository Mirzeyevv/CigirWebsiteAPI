import express from 'express';

// Controller-dən funksiyaları import edirik
import { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from '../controllers/newsCategoryController.js';

// Yeni router yaradırıq
const router = express.Router();

// '/' (əsas) endpoint-i üçün GET və POST sorğuları
router
    .route('/')
    .get(getAllCategories)
    .post(createCategory);

// '/:id' (ID ilə) endpoint-i üçün GET, PATCH və DELETE sorğuları
router
    .route('/:id')
    .get(getCategoryById)
    .patch(updateCategory)
    .delete(deleteCategory);

// Router-i export edirik ki, server.js-də istifadə edə bilək
export default router;