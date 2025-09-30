import Log from '../models/logModel.js';

export const getAllLogs = async (req, res) => {
    try {
        // Logları ən sondan əvvələ doğru sıralayırıq və istifadəçi adını da gətiririk
        const logs = await Log.find().sort({ timestamp: -1 }).populate('user', 'username');
        
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};