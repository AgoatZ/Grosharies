const CategoryService = require('.././../category/category.services');
const TagService = require('.././../tag/tag.services');
const PostRepository = require('.././../post/post.repository');

const calcWeights = async (history) => {
    const categoriesWeights = new Map();
    const groceriesWeights = new Map();
    const tagsWeights = new Map();
    try {
        for (piece in history) {
            //weigh tags
            let sourceId = history[piece].sourcePost;
            const tags = await getPostTags(sourceId);
            if (tags) {
                for (tag in tags) {
                    let tagName = tags[tag].name;
                    let tagRank = tagsWeights.get(tagName);
                    if (!tagRank) {
                        tagsWeights.set(tagName, 1);
                    } else {
                        tagsWeights.set(tagName, tagRank + 1);
                    }
                }
            }
            for (grocery in history[piece].content) {
                //weigh categories
                let catId = history[piece].content[grocery].category
                let category = await CategoryService.getCategoryById(catId);
                let catRank = categoriesWeights.get(category.name);
                console.log('catrank:', catRank);
                if (!catRank) {
                    categoriesWeights.set(category.name, 1);
                } else {
                    categoriesWeights.set(category.name, catRank + 1);
                }

                //weigh groceries
                let gro = history[piece].content[grocery];
                let groRank = groceriesWeights.get(gro.name);
                console.log('grorank:', groRank);
                if (!groRank) {
                    groceriesWeights.set(gro.name, gro.amount);
                } else {
                    groceriesWeights.set(gro.name, groRank + gro.amount);
                }
            }
        }
        return { categoriesWeights, groceriesWeights, tagsWeights };
    } catch (e) {
        console.log("calc whights", e);

        throw Error('Error calculating weights');
    }
};

const getPostTags = async (postId) => {
    try {
        const post = await PostRepository.getPostById(postId);
        const tags = [];
        for (tagId in post.tags) {
            const tag = await TagService.getTagById(post.tags[tagId]);
            tags.push(tag);
        }
        return tags;
    } catch (e) {
        console.log("get post tags", e);

        throw Error('Error while retrieving tags');
    }
};

const getPostRelevance = async (history, post) => {
    console.log('getPostRelevanceUtil');
    try {
        const { categoriesWeights, groceriesWeights, tagsWeights } = await calcWeights(history);
        console.log('rels:', categoriesWeights, groceriesWeights, tagsWeights);
        //add relevance regarding tags
        const tags = await getPostTags(post._id);
        console.log('tags from getPostRelevance:', tags);
        var relevance = 0;
        if (tags) {
            for (tag in tags) {
                const tagRank = tagsWeights.get(tags[tag].name);
                if (tagRank) {
                    relevance += tagRank;
                }
            }
        }

        //add relevance regarding categories and groceries
        for (grocery in post.content) {
            const category = await CategoryService.getCategoryById(post.content[grocery].original.category);
            const catRank = categoriesWeights.get(category.name);
            console.log('postRel catRank:', catRank);
            if (catRank) {
                relevance += catRank;
            }
            const groRank = groceriesWeights.get(post.content[grocery].original.name);
            console.log('postRel groRank:', groRank);
            if (groRank) {
                relevance += groRank;
            }
        }
        //console.log("relevance", relevance);
        return relevance;
    } catch (e) {
        console.log("get post relevance", e);

        throw Error('Error while determining post relevance');
    }
};

module.exports = {
    getPostRelevance,
    calcWeights,
    getPostTags
};