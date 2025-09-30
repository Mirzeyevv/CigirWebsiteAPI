import News from '../models/newsModel.js';
import Project from '../models/projectModel.js';
import NewsCategory from '../models/newsCategoryModel.js';
import ProjectCategory from '../models/projectCategoryModel.js';
import { createLog } from '../utils/logger.js'; // <-- Log funksiyasını import edirik

// @desc    Bütün "soft-deleted" elementləri gətirir
export const getDeletedItems = async (req, res) => {
    try {
        const [deletedNews, deletedProjects, deletedNewsCategories, deletedProjectCategories] = await Promise.all([
            News.findDeleted({}),
            Project.findDeleted({}),
            NewsCategory.findDeleted({}),
            ProjectCategory.findDeleted({})
        ]);

        const formattedNews = deletedNews.map(item => ({ ...item.toObject(), doc_type: 'Xəbər' }));
        const formattedProjects = deletedProjects.map(item => ({ ...item.toObject(), doc_type: 'Layihə' }));
        const formattedNewsCategories = deletedNewsCategories.map(item => ({ ...item.toObject(), doc_type: 'Xəbər Kateqoriyası' }));
        const formattedProjectCategories = deletedProjectCategories.map(item => ({ ...item.toObject(), doc_type: 'Layihə Kateqoriyası' }));

        const allDeletedItems = [
            ...formattedNews, 
            ...formattedProjects, 
            ...formattedNewsCategories, 
            ...formattedProjectCategories
        ];

        allDeletedItems.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
        
        res.status(200).json(allDeletedItems);
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// @desc    Seçilmiş bir elementi bərpa edir
export const restoreItem = async (req, res) => {
    const { id, type } = req.body;

    if (!id || !type) {
        return res.status(400).json({ status: 'fail', message: 'ID və Növ (type) tələb olunur.' });
    }

    let Model;
    let entityName; // Log üçün modelin adını saxlayaq
    switch (type) {
        case 'Xəbər': Model = News; entityName = 'News'; break;
        case 'Layihə': Model = Project; entityName = 'Project'; break;
        case 'Xəbər Kateqoriyası': Model = NewsCategory; entityName = 'NewsCategory'; break;
        case 'Layihə Kateqoriyası': Model = ProjectCategory; entityName = 'ProjectCategory'; break;
        default:
            return res.status(400).json({ status: 'fail', message: 'Yanlış növ (type) göndərildi.' });
    }

    try {
        const result = await Model.restore({ _id: id });
        
        if (!result || result.modifiedCount === 0) {
            return res.status(404).json({ status: 'fail', message: 'Bu ID-də silinmiş element tapılmadı.' });
        }

        // --- YENİ HİSSƏ: Bərpa əməliyyatını loglayırıq ---
        // Bərpa olunmuş sənədi tapıb adını/başlığını götürürük ki, log detallı olsun
        const restoredDoc = await Model.findById(id).lean();
        if (restoredDoc) {
            await createLog(req.user, 'RESTORE', entityName, id, { name: restoredDoc.name || restoredDoc.title });
        }
        // --- YENİ HİSSƏNİN SONU ---

        res.status(200).json({ status: 'success', message: `"${type}" uğurla bərpa edildi.` });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};