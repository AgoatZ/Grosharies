const CategoryService = require('.././../category/category.services');
const TagService = require('.././../tag/tag.services');
const PostService = require('.././../post/post.services');

const calcWeights = async (history) => {
    try {
        const categoriesWeights = new Map();
        const groceriesWeights = new Map();
        const tagsWeights = new Map();

        for (piece in history) {
            //weigh tags
            console.log(history[piece].sourcePost);
            const tags = await PostService.getPostTags(history[piece].sourcePost);
            for (tag in tags) {
                const tagRank = tagsWeights.get(tags[tag].name);
                if (!tagRank) {
                    tagsWeights.set(tags[tag].name, 1);
                } else {
                    tagsWeights.set(tags[tag].name, tagRank + 1);
                }
            }
            for (grocery in history[piece].content) {
                //weigh categories
                const category = await CategoryService.getCategoryById(history[piece].content[grocery].category);
                const catRank = categoriesWeights.get(category.name);
                if (!catRank) {
                    categoriesWeights.set(category.name, 1);
                } else {
                    categoriesWeights.set(category.name, catRank + 1);
                }

                //weigh groceries
                const groRank = groceriesWeights.get(history[piece].content[grocery].name);
                if (!groRank) {
                    groceriesWeights.set(history[piece].content[grocery].name, 1);
                } else {
                    groceriesWeights.set(history[piece].content[grocery].name, groRank + history[piece].content[grocery].amount);
                }
            }
        }
        return { categoriesWeights, groceriesWeights, tagsWeights };
    } catch (e) {
        throw Error('Error calculating weights');
    }
};

const getPostRelevance = async (history, post) => {
    try {
        const { categoriesWeights, groceriesWeights, tagsWeights } = await calcWeights(history);

        //add relevance regarding tags
        const tags = await PostService.getPostTags(post._id);
        console.log(tags);
        var relevance = 0;
        for (tag in tags) {
            const tagRank = tagsWeights.get(tags[tag].name);
            if (tagRank) {
                relevance += tagRank;
            }
        }

        //add relevance regarding categories and groceries
        for (grocery in post.content) {
            const category = await CategoryService.getCategoryById(post.content[grocery].category);
            const catRank = categoriesWeights.get(category);
            if (catRank) {
                relevance += catRank;
            }
            const groRank = groceriesWeights.get(post.content[grocery].name);
            if (groRank) {
                relevance += groRank;
            }
        }
        console.log(relevance);
        return relevance;
    } catch (e) {
        throw Error('Error while determining post relevance');
    }
};

module.exports = {
    getPostRelevance
};