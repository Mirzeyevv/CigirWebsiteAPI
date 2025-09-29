import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Qeyd: Bu funksiyanı yalnız admin çağıra biləcək (növbəti addımlarda tənzimləyəcəyik)
export const createUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Şifrəni hash-ləyirik
        const hashedPassword = bcryptjs.hashSync(password, 10);
        
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        
        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Wrong password!' });
        }
        
        // Şifrə düzgündürsə, token yaradırıq
        const token = jwt.sign(
            { id: validUser._id, role: validUser.role }, // Token-in içində saxlanacaq məlumat
            process.env.JWT_SECRET // .env faylındakı gizli açar
        );
            
        // Cavab olaraq istifadəçi məlumatlarını (şifrə xaric) və token-i göndəririk
        const { password: hashedPassword, ...rest } = validUser._doc;
        res.status(200).json({ ...rest, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};