const TagService = require('./tag.services');  

getTags = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const tags = await TagService.getTags({}, page, limit)
        return res.status(200).json({ tags: tags, message: "Succesfully Tags Retrieved" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

getTagById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const tag = await TagService.getTagById(req.params.id)
        return res.status(200).json({ tag: tag, message: "Succesfully Tag Retrieved" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

addTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const tag = await TagService.addTag(req.body);
        return res.status(200).json({ tag: tag, message: "Succesfully Tag Added" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

deleteTag = async function (req, res, next) {
    try {
        const tag = await TagService.deleteTag(req.params.id);
        return res.status(200).json({ tag: tag, message: "Succesfully Tag Deleted" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}

updateTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldTag = await TagService.updateTag(req.params.id, req.body);
        return res.status(200).json({ oldTag: oldTag, message: "Succesfully Tag Updated" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getTags,
    getTagById,
    addTag,
    deleteTag,
    updateTag
}