import News from '../models/newsModel.js';
import { createLog } from '../utils/logger.js';
import slugify from 'slugify';

export const createNews = async (req, res) => {
    try {
        const newNewsData = { ...req.body, createdBy: req.user._id };
        if (!newNewsData.slug) {
            newNewsData.slug = slugify(newNewsData.title, { lower: true, strict: true, locale: 'az' });
        }
        const newNews = await News.create(newNewsData);
        await createLog(req.user, 'CREATE', 'News', newNews._id, { title: newNews.title });
        res.status(201).json({ status: 'success', data: { news: newNews } });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.slug) {
            return res.status(400).json({ status: 'fail', message: 'Bu URL slug artıq istifadə olunur.' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().populate('categories').populate('createdBy', 'username');
        res.status(200).json(news);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

export const getNewsBySlug = async (req, res) => {
    try {
        const news = await News.findOne({ slug: req.params.slug }).populate('categories').populate('createdBy', 'username');
        if (!news) {
            return res.status(404).json({ status: 'fail', message: 'Bu URL-də xəbər tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { news } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

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

export const updateNews = async (req, res) => {
    try {
        const oldDoc = await News.findById(req.params.id).lean();
        if (!oldDoc) { return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' }); }

        const updateData = { ...req.body, updatedBy: req.user._id };
        if (updateData.title && !updateData.slug) {
            updateData.slug = slugify(updateData.title, { lower: true, strict: true, locale: 'az' });
        }

        const updatedDoc = await News.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        
        const details = {
            from: { title: oldDoc.title, slug: oldDoc.slug },
            to: { title: updatedDoc.title, slug: updatedDoc.slug }
        };
        await createLog(req.user, 'UPDATE', 'News', updatedDoc._id, details);
        
        res.status(200).json({ status: 'success', data: { news: updatedDoc } });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.slug) {
            return res.status(400).json({ status: 'fail', message: 'Bu URL slug artıq istifadə olunur.' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const newsToDelete = await News.findById(req.params.id);
        if (!newsToDelete) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' });
        }
        
        await newsToDelete.delete(req.user._id);
        
        await createLog(req.user, 'DELETE', 'News', req.params.id, { title: newsToDelete.title });
        
        res.status(200).json({ status: 'success', message: 'Xəbər uğurla silindi' });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};