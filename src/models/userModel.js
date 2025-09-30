import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [20, 'Username cannot be more than 20 characters long'],
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
});

userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true, deletedByUserstamp: true });

const User = mongoose.model('User', userSchema);

export default User;