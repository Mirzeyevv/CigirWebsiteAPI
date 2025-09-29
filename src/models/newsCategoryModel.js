// models/newsCategoryModel.js
import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete'; // <-- 1. IMPORT ET

const newsCategorySchema = new mongoose.Schema({
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
newsCategorySchema.plugin(mongooseDelete, { 
    overrideMethods: 'all', 
    deletedAt: true,
    deletedBy: true, 
    deletedByUserstamp: true 
});

const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);

export default NewsCategory;