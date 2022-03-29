var TagService = require('./tag.services');  

getTags = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : 10;
    try {
        var tags = await TagService.getTags({}, page, limit)
        return res.status(200).json({ status: 200, data: tags, message: "Succesfully Tags Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

getTagById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        var tag = await TagService.getTagById(req.params.id)
        return res.status(200).json({ status: 200, data: tag, message: "Succesfully Tag Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

addTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var tag = await TagService.addTag(req.body);
        return res.status(200).json({ status: 200, data: tag, message: "Succesfully Tag Added" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

deleteTag = async function (req, res, next) {
    try {
        var tag = await TagService.deleteTag(req.params.id);
        return res.status(200).json({ status: 200, data: tag, message: "Succesfully Tag Deleted" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

updateTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var oldTag = await TagService.updateTag(req.params.id, req.body);
        return res.status(200).json({ status: 200, data: oldTag, message: "Succesfully Tag Updated" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports = {
    getTags,
    getTagById,
    addTag,
    deleteTag,
    updateTag
}