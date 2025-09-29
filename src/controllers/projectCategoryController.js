// controllers/projectCategoryController.js
import ProjectCategory from '../models/projectCategoryModel.js';
import { createLog } from '../utils/logger.js';

// @desc    Yeni bir layihə kateqoriyası yarat
export const createProjectCategory = async (req, res) => {
    try {
        const newCategoryData = {
            name: req.body.name,
            createdBy: req.user._id
        };
        const newCategory = await ProjectCategory.create(newCategoryData);

        await createLog(req.user, 'CREATE', 'ProjectCategory', newCategory._id);
        
        res.status(201).json({
            status: 'success',
            data: { category: newCategory }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bütün layihə kateqoriyalarını gətir
export const getAllProjectCategories = async (req, res) => {
    try {
        const categories = await ProjectCategory.find();
        // Frontend-in gözlədiyi kimi birbaşa massiv formatında qaytarırıq
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihə kateqoriyasını ID-yə görə gətir
export const getProjectCategoryById = async (req, res) => {
    try {
        const category = await ProjectCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihə kateqoriyasını yenilə
export const updateProjectCategory = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            updatedBy: req.user._id
        };
        const category = await ProjectCategory.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }

        await createLog(req.user, 'UPDATE', 'ProjectCategory', category._id);

        res.status(200).json({
            status: 'success',
            data: { category }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihə kateqoriyasını sil (soft delete)
export const deleteProjectCategory = async (req, res) => {
    try {
        const category = await ProjectCategory.deleteById(req.params.id, req.user._id);

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        
        await createLog(req.user, 'DELETE', 'ProjectCategory', req.params.id);
        
        res.status(200).json({
            status: 'success',
            message: 'Kateqoriya uğurla silindi'
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};