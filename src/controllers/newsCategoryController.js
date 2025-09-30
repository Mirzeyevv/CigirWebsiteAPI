import NewsCategory from '../models/newsCategoryModel.js';
import { createLog } from '../utils/logger.js';

export const createCategory = async (req, res) => {
    try {
        const newCategory = await NewsCategory.create({ name: req.body.name, createdBy: req.user._id });
        await createLog(req.user, 'CREATE', 'NewsCategory', newCategory._id, { name: newCategory.name });
        res.status(201).json({ status: 'success', data: { category: newCategory } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await NewsCategory.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await NewsCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const oldDoc = await NewsCategory.findById(req.params.id).lean();
        if (!oldDoc) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        
        const updateData = { name: req.body.name, updatedBy: req.user._id };
        const updatedDoc = await NewsCategory.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        const details = { from: { name: oldDoc.name }, to: { name: updatedDoc.name } };
        await createLog(req.user, 'UPDATE', 'NewsCategory', updatedDoc._id, details);

        res.status(200).json({ status: 'success', data: { category: updatedDoc } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        // 1. Əvvəlcə elementi tapırıq ki, məlumatlarını götürə bilək
        const categoryToDelete = await NewsCategory.findById(req.params.id);
        if (!categoryToDelete) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        
        // 2. Elementin öz üzərində delete metodunu çağırırıq (bu soft delete edəcək)
        await categoryToDelete.delete(req.user._id);
        
        // 3. İndi əlimizdə olan məlumatla detallı log yaradırıq
        await createLog(req.user, 'DELETE', 'NewsCategory', req.params.id, { name: categoryToDelete.name });
        
        res.status(200).json({
            status: 'success',
            message: 'Kateqoriya uğurla silindi'
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};