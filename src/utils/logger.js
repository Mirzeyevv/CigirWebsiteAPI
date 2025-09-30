// utils/logger.js
import Log from '../models/logModel.js';

export const createLog = async (user, action, entity, entityId = null, details = null) => {
    try {
        if (!user || !user._id) {
            console.error('Log yaratmaq üçün istifadəçi məlumatı tapılmadı.');
            return;
        }
        await Log.create({
            user: user._id,
            action,
            entity,
            entityId,
            details // Əgər "details" null-dırsa, MongoDB bu sahəni əlavə etməyəcək
        });
    } catch (error) {
        console.error(`Log yaratmaq mümkün olmadı:`, error);
    }
};