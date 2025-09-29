import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: [10, 'Title must be at least 10 characters long'],
        maxLength: [150, 'Title cannot be more than 150 characters long']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minLength: [50, 'Content must be at least 50 characters long'],
        maxLength: [20000, 'Content cannot be more than 20000 characters long']
    },
    coverPhoto: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    video: {
        type: String 
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsCategory'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const News = mongoose.model('News', newsSchema);

export default News;