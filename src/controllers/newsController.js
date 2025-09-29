// controllers/newsController.js
import News from '../models/newsModel.js';
import { createLog } from '../utils/logger.js';

// @desc    Yeni bir xəbər yarat
export const createNews = async (req, res) => {
    try {
        // Artıq bütün datanı birbaşa req.body-dən götürürük, çünki şəkillər link olaraq gəlir
        const newNewsData = {
            ...req.body, // Bütün sahələr: title, content, coverPhoto (link), images (linklər massivi), video, categories
            createdBy: req.user._id // Middleware-dən gələn istifadəçi
        };

        const newNews = await News.create(newNewsData);

        // Uğurlu əməliyyat üçün log yarat
        await createLog(req.user, 'CREATE', 'News', newNews._id);

        res.status(201).json({ status: 'success', data: { news: newNews } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bütün xəbərləri gətir
export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().populate('categories').populate('createdBy', 'username');
        res.status(200).json(news);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir xəbəri ID-yə görə gətir
export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id).populate('categories').populate('createdBy', 'username');
        if (!news) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { news } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir xəbəri yenilə
export const updateNews = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.user._id };

        const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!news) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' });
        }

        // Uğurlu əməliyyat üçün log yarat
        await createLog(req.user, 'UPDATE', 'News', news._id);

        res.status(200).json({ status: 'success', data: { news } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir xəbəri sil (soft delete)
export const deleteNews = async (req, res) => {
    try {
        const news = await News.deleteById(req.params.id, req.user._id);
        if (!news) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' });
        }

        // Uğurlu əməliyyat üçün log yarat
        await createLog(req.user, 'DELETE', 'News', req.params.id);

        res.status(200).json({ status: 'success', message: 'Xəbər uğurla silindi' });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};