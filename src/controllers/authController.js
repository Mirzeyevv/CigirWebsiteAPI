import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createLog } from '../utils/logger.js';

export const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        
        // Yaradan adminin məlumatı ilə yeni istifadəçinin yaradılmasını loglayırıq
        await createLog(req.user, 'CREATE', 'User', newUser._id, { username: newUser.username });

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const validUser = await User.findOne({ username });
        if (!validUser) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        
        const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET);
        
        // Uğurlu giriş üçün log yaradırıq
        await createLog(validUser, 'LOGIN', 'User', validUser._id);
        
        const { password: hashedPassword, ...rest } = validUser._doc;
        res.status(200).json({ user: rest, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

export const logout = async (req, res) => {
    try {
        // Uğurlu çıxış üçün log yaradırıq
        await createLog(req.user, 'LOGOUT', 'User', req.user._id);
        res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: `Logout failed: ${error.message}` });
    }
};