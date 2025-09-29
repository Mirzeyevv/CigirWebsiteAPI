// controllers/newsCategoryController.js
import NewsCategory from '../models/newsCategoryModel.js';
import { createLog } from '../utils/logger.js';

// @desc    Yeni kateqoriya yarat
export const createCategory = async (req, res) => {
    try {
        const newCategoryData = {
            name: req.body.name,
            createdBy: req.user._id
        };
        const newCategory = await NewsCategory.create(newCategoryData);

        await createLog(req.user, 'CREATE', 'NewsCategory', newCategory._id);
        
        res.status(201).json({
            status: 'success',
            data: {
                category: newCategory
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// @desc    Bütün kateqoriyaları gətir
export const getAllCategories = async (req, res) => {
    try {
        const categories = await NewsCategory.find();
        // Frontend-in gözlədiyi kimi birbaşa massiv formatında qaytarırıq
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

// @desc    Bir kateqoriyanı ID-yə görə gətir
export const getCategoryById = async (req, res) => {
    try {
        const category = await NewsCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                category
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir kateqoriyanı yenilə
export const updateCategory = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            updatedBy: req.user._id
        };
        const category = await NewsCategory.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }

        await createLog(req.user, 'UPDATE', 'NewsCategory', category._id);

        res.status(200).json({
            status: 'success',
            data: {
                category
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir kateqoriyanı sil (soft delete)
export const deleteCategory = async (req, res) => {
    try {
        const category = await NewsCategory.deleteById(req.params.id, req.user._id);

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        
        await createLog(req.user, 'DELETE', 'NewsCategory', req.params.id);
        
        res.status(200).json({
            status: 'success',
            message: 'Kateqoriya uğurla silindi'
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};