import mongoose from 'mongoose';

const newsCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);

export default NewsCategory;