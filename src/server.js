import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './scheduler.js';
import authRouter from './routes/authRoutes.js'; 
import newsCategoryRouter from './routes/newsCategoryRoutes.js';
import projectCategoryRouter from './routes/projectCategoryRoutes.js';
import newsRouter from './routes/newsRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import logRouter from './routes/logRoutes.js';
import recycleBinRouter from './routes/recycleBinRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173' 
}));

// --- API Routes ---
app.use('/api/users', userRouter);
app.use('/api/recycle-bin', recycleBinRouter);
app.use('/api/logs', logRouter);
app.use('/api/auth', authRouter);
app.use('/api/news-categories', newsCategoryRouter);
app.use('/api/project-categories', projectCategoryRouter);
app.use('/api/news', newsRouter);
app.use('/api/projects', projectRouter);

// --- Database Connection ---
mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log('DB connection error:', err));





// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server http://localhost:${PORT} working on...`));