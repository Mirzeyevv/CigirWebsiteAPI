import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import newsCategoryRouter from './routes/newsCategoryRoutes.js';
import projectCategoryRouter from './routes/projectCategoryRoutes.js';
import newsRouter from './routes/newsRoutes.js';
import projectRouter from './routes/projectRoutes.js';
// .env faylındakı dəyişənləri yükləyir
dotenv.config();

const app = express();

// Gələn JSON request-lərini anlamaq üçün middleware
app.use(express.json());

// --- API Routes ---
app.use('/api/news-categories', newsCategoryRouter);
app.use('/api/project-categories', projectCategoryRouter);
app.use('/api/news', newsRouter);
app.use('/api/projects', projectRouter);
// Gələcəkdə layihə route-ları da bura əlavə olunacaq

// --- Database Connection ---
mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log('Database bağlantısı uğurludur!');
    })
    .catch((err) => {
        console.log('DB connection error:', err);
    });

// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} portunda işləyir...`);
});