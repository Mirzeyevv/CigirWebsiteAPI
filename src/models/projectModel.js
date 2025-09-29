// models/projectModel.js
import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete'; // <-- 1. IMPORT ET

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: [10, 'Title must be at least 10 characters long'],
        maxLength: [150, 'Title cannot be more than 150 characters long']
    },
    slogan: {
        type: String,
        trim: true,
        maxLength: [200, 'Slogan cannot be more than 200 characters long']
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        minLength: [20, 'Short description must be at least 20 characters long'],
        maxLength: [500, 'Short description cannot be more than 500 characters long']
    },
    goal: {
        type: String,
        required: [true, 'Goal is required'],
        minLength: [15, 'Goal must be at least 15 characters long'],
        maxLength: [1000, 'Goal cannot be more than 1000 characters long']
    },
    implementationDetails: {
        type: String,
        maxLength: [10000, 'Implementation details cannot be more than 10000 characters long']
    },
    coverPhoto: {
        type: String,
        required: [true, 'Cover photo is required']
    },
    images: [{ type: String }],
    video: { type: String },
    logo: { type: String },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectCategory'
    }],
    type: { type: String },
    startDate: { type: Date },
    status: {
        type: String,
        enum: ['Active', 'Finished', 'Planning'],
        default: 'Planning'
    },
    contactNumber: {
        type: String,
        minLength: [7, 'Contact number must be at least 7 characters long'],
        maxLength: [20, 'Contact number cannot be more than 20 characters long']
    },
    socialLinks: [{ type: String }],
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
projectSchema.plugin(mongooseDelete, { 
    overrideMethods: 'all', 
    deletedAt: true,
    deletedBy: true, 
    deletedByUserstamp: true 
});

const Project = mongoose.model('Project', projectSchema);

export default Project;