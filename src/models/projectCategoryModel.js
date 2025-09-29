// models/projectCategoryModel.js
import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete'; // <-- 1. IMPORT ET

const projectCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    // `deletedBy` sahəsini schemadan silirik, plugin özü idarə edəcək
}, {
    timestamps: true
});

// <-- 2. PLUGİNİ ƏLAVƏ ET
projectCategorySchema.plugin(mongooseDelete, { 
    overrideMethods: 'all', 
    deletedAt: true,
    deletedBy: true, 
    deletedByUserstamp: true 
});

const ProjectCategory = mongoose.model('ProjectCategory', projectCategorySchema);

export default ProjectCategory;