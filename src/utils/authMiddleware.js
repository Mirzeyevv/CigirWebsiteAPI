import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer " hissəsini kəsib atırıq, yalnız token-i götürürük
            token = req.headers.authorization.split(' ')[1];
            
            // Token-in düzgünlüyünü yoxlayırıq
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Token-dən oxuduğumuz user ID-si ilə istifadəçini tapırıq
            req.user = await User.findById(decoded.id).select('-password');
            
            // --- BİZİM ƏSAS TESTİMİZ BURADADIR ---
            // Token-dən tapılan istifadəçinin kim olduğunu terminalda dəqiq görək
            console.log('--- PROTECT MIDDLEWARE İŞLƏDİ: TAPILAN İSTİFADƏÇİ ---', req.user);
            // ------------------------------------
            
            if (req.user) {
                next(); // Hər şey qaydasındadırsa, növbəti funksiyaya keç
            } else {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Rolu "admin"-dirsə, növbəti funksiyaya keç
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};