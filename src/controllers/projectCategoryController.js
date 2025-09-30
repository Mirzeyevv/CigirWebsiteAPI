import ProjectCategory from '../models/projectCategoryModel.js';
import { createLog } from '../utils/logger.js';

export const createProjectCategory = async (req, res) => {
    try {
        const newCategory = await ProjectCategory.create({ name: req.body.name, createdBy: req.user._id });
        await createLog(req.user, 'CREATE', 'ProjectCategory', newCategory._id, { name: newCategory.name });
        res.status(201).json({ status: 'success', data: { category: newCategory } });
    } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

export const getAllProjectCategories = async (req, res) => {
    try {
        const categories = await ProjectCategory.find();
        res.status(200).json(categories);
    } catch (err) { res.status(500).json({ status: 'fail', message: err.message }); }
};

export const getProjectCategoryById = async (req, res) => {
    try {
        const category = await ProjectCategory.findById(req.params.id);
        if (!category) { return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' }); }
        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) { res.status(500).json({ status: 'fail', message: err.message }); }
};

export const updateProjectCategory = async (req, res) => {
    try {
        const oldDoc = await ProjectCategory.findById(req.params.id).lean();
        if (!oldDoc) { return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' }); }

        const updateData = { name: req.body.name, updatedBy: req.user._id };
        const updatedDoc = await ProjectCategory.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        const details = { from: { name: oldDoc.name }, to: { name: updatedDoc.name } };
        await createLog(req.user, 'UPDATE', 'ProjectCategory', updatedDoc._id, details);

        res.status(200).json({ status: 'success', data: { category: updatedDoc } });
    } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

export const deleteProjectCategory = async (req, res) => {
    try {
        const categoryToDelete = await ProjectCategory.findById(req.params.id);
        if (!categoryToDelete) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        
        await categoryToDelete.delete(req.user._id);
        
        await createLog(req.user, 'DELETE', 'ProjectCategory', req.params.id, { name: categoryToDelete.name });
        
        res.status(200).json({
            status: 'success',
            message: 'Kateqoriya uğurla silindi'
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};