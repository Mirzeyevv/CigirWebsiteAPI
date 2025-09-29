import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Asynchronous version for better performance
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        
        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    console.log("--- LOG 1: /login request received ---");
    const { username, password } = req.body;
    console.log(`--- LOG 2: Data from body: username=${username}`);

    try {
        const validUser = await User.findOne({ username });

        if (!validUser) {
            console.log("--- ERROR: User not found! ---");
            // For security, we send a generic message.
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        console.log("--- LOG 3: User found in database:", validUser.username);

        const validPassword = await bcryptjs.compare(password, validUser.password);

        if (!validPassword) {
            console.log("--- ERROR: Password is not valid! ---");
            // For security, we send the same generic message.
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        console.log("--- LOG 4: Password verified successfully ---");
        
        console.log("--- LOG 5: PREPARING TO CREATE TOKEN. JWT_SECRET value:", process.env.JWT_SECRET);
        const token = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.JWT_SECRET
        );
        console.log("--- LOG 6: Token created successfully ---");
        
        const { password: hashedPassword, ...rest } = validUser._doc;
        
        console.log("--- LOG 7: PREPARING TO SEND RESPONSE ---");
        res.status(200).json({ user: rest, token });

    } catch (error) {
        console.log("--- CATCH ERROR: Execution fell into the 'catch' block! ---");
        console.error(error); // Log the full error for debugging
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};