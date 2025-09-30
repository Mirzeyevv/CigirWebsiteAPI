// controllers/userController.js
import User from '../models/userModel.js';
import { createLog } from '../utils/logger.js';

export const getAllUsers = async (req, res) => {
    try {
        // Bütün istifadəçiləri şifrə sahəsi olmadan gətiririk
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        // Adminin özünü silməsinin qarşısını alırıq
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: 'Admin özünü silə bilməz.' });
        }

        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        await userToDelete.delete(req.user._id);
        await createLog(req.user, 'DELETE', 'User', req.params.id, { username: userToDelete.username });
        
        res.status(200).json({ message: 'İstifadəçi uğurla silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};