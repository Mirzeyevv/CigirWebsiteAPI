import mongoose from 'mongoose';

const projectCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const ProjectCategory = mongoose.model('ProjectCategory', projectCategorySchema);

export default ProjectCategory;