const CategoryService = require('./category.services');  

getCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 30;
    try {
        const categories = await CategoryService.getCategories({}, page, limit);
        return res.status(200).json({ categories: categories, message: "Succesfully Categories Retrieved" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

getCategoryById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const category = await CategoryService.getCategoryById(req.params.id);
        return res.status(200).json({ category: category, message: "Succesfully Category Retrieved" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

addCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const category = await CategoryService.addCategory(req.body);
        return res.status(200).json({ category: category, message: "Succesfully Category Added" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

deleteCategory = async function (req, res, next) {
    try {
        const category = await CategoryService.deleteCategory(req.params.id);
        return res.status(200).json({ category: category, message: "Succesfully Category Deleted" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}

updateCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldCategory = await CategoryService.updateCategory(req.params.id, req.body);
        return res.status(200).json({ oldCategory: oldCategory, message: "Succesfully Category Updated" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getCategory,
    getCategoryById,
    addCategory,
    deleteCategory,
    updateCategory
}