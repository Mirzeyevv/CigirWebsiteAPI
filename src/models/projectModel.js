import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slogan: { type: String, trim: true },
    shortDescription: { type: String, required: true },
    coverPhoto: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectCategory' // <-- Dəyişiklik edildi
    }],
    type: { type: String },
    startDate: { type: Date },
    goal: { type: String, required: true },
    implementationDetails: { type: String },
    status: {
        type: String,
        enum: ['aktiv', 'bitmiş', 'planlaşdırılan'], // Yalnız bu dəyərləri qəbul edəcək
        default: 'planlaşdırılan'
    },
    contactNumber: { type: String },
    socialLinks: [{ type: String }],
    logo: { type: String }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;