import NewsCategory from '../models/newsCategoryModel.js';

export const createCategory = async (req, res) => {
    try {
        const newCategory = await NewsCategory.create({ name: req.body.name });
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

export const getAllCategories = async (req, res) => {
    try {
        const categories = await NewsCategory.find();
        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: {
                categories
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};


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


export const updateCategory = async (req, res) => {
    try {
        const category = await NewsCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await NewsCategory.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də kateqoriya tapılmadı' });
        }
        
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err)
        {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};