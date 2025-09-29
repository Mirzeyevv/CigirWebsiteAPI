import Project from '../models/projectModel.js';

// @desc    Yeni bir layihə yarat
export const createProject = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json({ status: 'success', data: { project: newProject } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bütün layihələri gətir
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('categories');
        res.status(200).json({ status: 'success', results: projects.length, data: { projects } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihəni ID-yə görə gətir
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('categories');
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { project } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihəni yenilə
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' });
        }
        res.status(200).json({ status: 'success', data: { project } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihəni sil
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};