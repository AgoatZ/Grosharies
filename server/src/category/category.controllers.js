var CategoryService = require('./category.services');  

getCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : 10;
    try {
        var categories = await CategoryService.getCategories({}, page, limit)
        return res.status(200).json({ status: 200, data: categories, message: "Succesfully Categories Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

getCategoryById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        var category = await CategoryService.getCategoryById(req.params.id)
        return res.status(200).json({ status: 200, data: category, message: "Succesfully Category Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

addCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var category = await CategoryService.addCategory(req.body);
        return res.status(200).json({ status: 200, data: category, message: "Succesfully Category Added" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

deleteCategory = async function (req, res, next) {
    try {
        var category = await CategoryService.deleteCategory(req.params.id);
        return res.status(200).json({ status: 200, data: category, message: "Succesfully Category Deleted" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

updateCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var oldCategory = await CategoryService.updateCategory(req.params.id, req.body);
        return res.status(200).json({ status: 200, data: oldCategory, message: "Succesfully Category Updated" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports = {
    getCategory,
    getCategoryById,
    addCategory,
    deleteCategory,
    updateCategory
}