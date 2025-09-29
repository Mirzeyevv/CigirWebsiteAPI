import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// 1. Giriş yoxlaması (Authentication)
export const protect = async (req, res, next) => {
    let token;
    
    // Token-i header-dən oxuyuruq (Format: "Bearer TOKEN")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer " hissəsini kəsib atırıq, yalnız token-i götürürük
            token = req.headers.authorization.split(' ')[1];
            
            // Token-in düzgünlüyünü .env-dəki gizli açar ilə yoxlayırıq
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Token-dən oxuduğumuz user ID-si ilə istifadəçini tapıb,
            // şifrə xaric digər məlumatlarını request-ə əlavə edirik
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Hər şey qaydasındadırsa, növbəti funksiyaya keç
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Admin rol yoxlaması (Authorization)
export const isAdmin = (req, res, next) => {
    // `protect` middleware-i işlədikdən sonra req.user-də məlumatımız olur
    if (req.user && req.user.role === 'admin') {
        next(); // Rolu "admin"-dirsə, növbəti funksiyaya keç
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};