import ProjectCategory from '../models/projectCategoryModel.js';

// @desc    Yeni bir layihə kateqoriyası yarat
// @route   POST /api/project-categories
export const createProjectCategory = async (req, res) => {
    try {
        const newCategory = await ProjectCategory.create({ name: req.body.name });
        res.status(201).json({
            status: 'success',
            data: { category: newCategory }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bütün layihə kateqoriyalarını gətir
// @route   GET /api/project-categories
export const getAllProjectCategories = async (req, res) => {
    try {
        const categories = await ProjectCategory.find();
        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: { categories }
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihə kateqoriyasını ID-yə görə gətir
// @route   GET /api/project-categories/:id
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
// @route   PATCH /api/project-categories/:id
export const updateProjectCategory = async (req, res) => {
    try {
        const category = await ProjectCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihə kateqoriyasını sil
// @route   DELETE /api/project-categories/:id
export const deleteProjectCategory = async (req, res) => {
    try {
        const category = await ProjectCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};