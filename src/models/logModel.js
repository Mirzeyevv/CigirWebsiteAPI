// models/logModel.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'RESTORE'] // Əməliyyat növləri
    },
    entity: {
        type: String,
        required: true // Hansı model üzərində əməliyyat aparılıb (məs: 'News', 'Project')
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId // Hansı sənəd üzərində əməliyyat aparılıb
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
});

const Log = mongoose.model('Log', logSchema);
export default Log;