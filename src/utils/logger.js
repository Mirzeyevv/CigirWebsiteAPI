// utils/logger.js
import Log from '../models/logModel.js';

/**
 * Verilənlər bazasında yeni bir log yaradır.
 * @param {object} user - Əməliyyatı edən istifadəçi obyekti (req.user)
 * @param {string} action - Əməliyyatın növü ('CREATE', 'UPDATE', 'DELETE')
 * @param {string} entity - Modelin adı ('News', 'Project', etc.)
 * @param {mongoose.Types.ObjectId} entityId - Sənədin ID-si
 */
export const createLog = async (user, action, entity, entityId = null) => {
    // Log yaratmaqda baş verən hər hansı bir xəta əsas əməliyyata təsir etməməlidir.
    // Ona görə bunu ayrıca try/catch bloku içinə alırıq.
    try {
        if (!user || !user._id) {
            console.error('Log yaratmaq üçün istifadəçi məlumatı tapılmadı.');
            return;
        }
        await Log.create({
            user: user._id,
            action,
            entity,
            entityId
        });
    } catch (error) {
        // Əgər log yaratmaqda xəta olsa, bunu sadəcə server konsolunda göstəririk
        // və proqramın işinə davam etməsinə icazə veririk.
        console.error('Log yaratmaq mümkün olmadı:', error);
    }
};