import Project from '../models/projectModel.js';
import { createLog } from '../utils/logger.js';
import slugify from 'slugify';

export const createProject = async (req, res) => {
    try {
        const newProjectData = { ...req.body, createdBy: req.user._id };
        if (!newProjectData.slug) {
            newProjectData.slug = slugify(newProjectData.title, { lower: true, strict: true, locale: 'az' });
        }
        const newProject = await Project.create(newProjectData);
        await createLog(req.user, 'CREATE', 'Project', newProject._id, { title: newProject.title });
        res.status(201).json({ status: 'success', data: { project: newProject } });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.slug) {
            return res.status(400).json({ status: 'fail', message: 'Bu URL slug artıq istifadə olunur.' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('categories').populate('createdBy', 'username');
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

export const getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug }).populate('categories').populate('createdBy', 'username');
        if (!project) { return res.status(404).json({ status: 'fail', message: 'Bu URL-də layihə tapılmadı' }); }
        res.status(200).json({ status: 'success', data: { project } });
    } catch (err) { res.status(500).json({ status: 'fail', message: err.message }); }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('categories');
        if (!project) { return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' }); }
        res.status(200).json({ status: 'success', data: { project } });
    } catch (err) { res.status(500).json({ status: 'fail', message: err.message }); }
};

export const updateProject = async (req, res) => {
    try {
        const oldDoc = await Project.findById(req.params.id).lean();
        if (!oldDoc) { return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' }); }

        const updateData = { ...req.body, updatedBy: req.user._id };
        if (updateData.title && !updateData.slug) {
            updateData.slug = slugify(updateData.title, { lower: true, strict: true, locale: 'az' });
        }
        
        const updatedDoc = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        
        const details = {
            from: { title: oldDoc.title, status: oldDoc.status },
            to: { title: updatedDoc.title, status: updatedDoc.status }
        };
        await createLog(req.user, 'UPDATE', 'Project', updatedDoc._id, details);
        
        res.status(200).json({ status: 'success', data: { project: updatedDoc } });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.slug) {
            return res.status(400).json({ status: 'fail', message: 'Bu URL slug artıq istifadə olunur.' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const projectToDelete = await Project.findById(req.params.id);
        if (!projectToDelete) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də layihə tapılmadı' });
        }
        
        await projectToDelete.delete(req.user._id);
        
        await createLog(req.user, 'DELETE', 'Project', req.params.id, { title: projectToDelete.title });
        
        res.status(200).json({ status: 'success', message: 'Layihə uğurla silindi' });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};