// scheduler.js
import cron from 'node-cron';
// --- DÜZƏLİŞLƏR AŞAĞIDAKI İMPORTLARDADIR ---
import Log from './models/logModel.js';
import News from './models/newsModel.js';
import Project from './models/projectModel.js';
import NewsCategory from './models/newsCategoryModel.js';
import ProjectCategory from './models/projectCategoryModel.js';

console.log('✅ Scheduler uğurla quruldu və işə hazırdır.');

// Hər gün gecə saat 00:00-da işə düşəcək bir cron job
cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] Gündəlik təmizləmə işi başladı...`);

    // --- 1. Bir aydan köhnə "soft-deleted" məlumatları həmişəlik silmək ---
    const oneMonthAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    
    try {
        const modelsToClean = [News, Project, NewsCategory, ProjectCategory];
        
        for (const model of modelsToClean) {
            const result = await model.deleteMany({
                deleted: true,
                deletedAt: { $lt: oneMonthAgo }
            });

            if (result.deletedCount > 0) {
                console.log(`🧹 ${model.modelName} kolleksiyasından ${result.deletedCount} köhnə sənəd həmişəlik silindi.`);
            }
        }
    } catch (error) {
        console.error('Soft-deleted məlumatları təmizləyərkən xəta baş verdi:', error);
    }

    // 1. Bir aydan köhnə LOGIN və LOGOUT loglarını silmək
    const oneMonthAgoLogs = new Date(new Date().setDate(new Date().getDate() - 30));
    try {
        const result = await Log.deleteMany({
            action: { $in: ['LOGIN', 'LOGOUT'] }, // Yalnız LOGIN və LOGOUT olanlar
            timestamp: { $lt: oneMonthAgoLogs }
        });
        if (result.deletedCount > 0) {
            console.log(`🧹 Logs kolleksiyasından ${result.deletedCount} köhnə login/logout qeydi həmişəlik silindi.`);
        }
    } catch (error) {
        console.error('Köhnə login/logout loglarını təmizləyərkən xəta baş verdi:', error);
    }

    // 2. Altı aydan köhnə DİGƏR (CREATE, UPDATE, DELETE) logları silmək
    const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
    try {
        const result = await Log.deleteMany({
            action: { $nin: ['LOGIN', 'LOGOUT'] }, // LOGIN və LOGOUT olmayanlar
            timestamp: { $lt: sixMonthsAgo }
        });
        if (result.deletedCount > 0) {
            console.log(`🧹 Logs kolleksiyasından ${result.deletedCount} köhnə əməliyyat qeydi həmişəlik silindi.`);
        }
    } catch (error) {
        console.error('Köhnə əməliyyat loglarını təmizləyərkən xəta baş verdi:', error);
    }

    console.log(`[${new Date().toISOString()}] Gündəlik təmizləmə işi başa çatdı.`);
});