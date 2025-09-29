import News from '../models/newsModel.js';

// @desc    Yeni bir xəbər yarat
export const createNews = async (req, res) => {
    try {
        const newNews = await News.create(req.body);
        res.status(201).json({ status: 'success', data: { news: newNews } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bütün xəbərləri gətir
export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().populate('categories');
        res.status(200).json({ status: 'success', results: news.length, data: { news } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir xəbəri ID-yə görə gətir
export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id).populate('categories');
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
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!news) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { news } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir xəbəri sil
export const deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də xəbər tapılmadı' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};