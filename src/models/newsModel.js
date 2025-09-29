import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Başlıq daxil edilməlidir'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Mətn daxil edilməlidir']
    },
    coverPhoto: {
        type: String, // Faylın URL və ya yolunu saxlayacağıq
        required: true
    },
    images: [{
        type: String // Şəkillərin URL və ya yollarını bir massivdə saxlayacağıq
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsCategory' // Bu, Category modelinə bir referansdır
    }]
}, {
    timestamps: true // `createdAt` və `updatedAt` avtomatik yaranacaq
});

const News = mongoose.model('News', newsSchema);

export default News;