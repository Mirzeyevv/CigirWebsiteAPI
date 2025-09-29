// controllers/projectController.js
import Project from '../models/projectModel.js';
import { createLog } from '../utils/logger.js';

// @desc    Yeni bir layihə yarat
export const createProject = async (req, res) => {
    try {
        const newProjectData = {
            ...req.body,
            createdBy: req.user._id
        };
        const newProject = await Project.create(newProjectData);

        await createLog(req.user, 'CREATE', 'Project', newProject._id);

        res.status(201).json({ status: 'success', data: { project: newProject } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bütün layihələri gətir
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('categories').populate('createdBy', 'username');
        // Frontend-in gözlədiyi kimi birbaşa massiv formatında qaytarırıq
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihəni ID-yə görə gətir
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('categories').populate('createdBy', 'username');
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
        const updateData = { ...req.body, updatedBy: req.user._id };

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' });
        }
        
        await createLog(req.user, 'UPDATE', 'Project', project._id);
        
        res.status(200).json({ status: 'success', data: { project } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Bir layihəni sil (soft delete)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.deleteById(req.params.id, req.user._id);
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' });
        }
        
        await createLog(req.user, 'DELETE', 'Project', req.params.id);
        
        res.status(200).json({ status: 'success', message: 'Layihə uğurla silindi' });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};