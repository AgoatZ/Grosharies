const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./grocery.repository');
const router = express.Router();
const fs = require('fs');

const getGroceries = async function (query, page, limit) {
    try {
        const groceries = await Repository.getGroceries(query);
        return groceries;
    } catch (e) {
        console.log('Grocery service error from getGroceries: ', e.message);

        throw Error('Error while Paginating Groceries');
    }
};

const getGroceryById = async function (groceryId) {
    try {
        const grocery = await Repository.getGroceryById(groceryId);
        return grocery;
    } catch (e) {
        console.log('Grocery service error from getGroceryById: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

const getGroceryByName = async function (groceryName) {
    try {
        const grocery = await Repository.getGroceryByName(groceryName);
        return grocery;
    } catch (e) {
        console.log('Grocery service error from getGroceryByName: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

const addGrocery = async function (groceryDetails) {
    try {
        const grocery = await Repository.addGrocery(groceryDetails);
        return grocery;
    } catch (e) {
        console.log('Grocery service error from addGrocery: ', e.message);

        throw Error('Error while Adding Grocery');
    }
};

const deleteGrocery = async function (groceryId) {
    try {
        const deletedGrocery = await Repository.deleteGrocery(groceryId);
        return deletedGrocery;
    } catch (e) {
        console.log('Grocery service error from deleteGrocery: ', e.message);

        throw Error('Error while Deleting Grocery');
    }
};

const updateGrocery = async function (groceryId, groceryDetails) {
    try {
        const oldGrocery = await Repository.updateGrocery(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        console.log('Grocery service error from updateGrocery: ', e.message);

        throw Error('Error while Updating Grocery');
    }
};

// const updateImage = async (req, res) => {
//     try {
//         const r = Date.now() + Math.round(Math.random() * 1E9);
//         const newFile = fs.createWriteStream(r.toString() + '.txt');
//         const chData = [];
//         newFile.on('open', () => {
//             req.pipe(newFile, (error) => {
//                 throw Error(error);
//             });

//             req.on('data', function (chunk, error) {
//                 chData.push(chunk);
//             });

//             req.on('end', async (error) => {
//                 const enc = Buffer.from(chData).toString("base64");
//                 fs.rm(newFile.path, async (error) => {
//                     if (error) {
//                         throw Error(error);
//                     } else {
//                         const oldGrocery = await Repository.updateGrocery(req.params.id, { image: enc });
//                         const grocery = await Repository.getGroceryById(oldGrocery._id);
//                         newFile.close();
//                         return res.status(200).json({ grocery: grocery, message: 'Successfully uploaded image' });
//                     }
//                 });
//             });
//         });
//     } catch (err) {
//         throw Error(err);
//     }
// };

module.exports = {
    getGroceries,
    getGroceryById,
    getGroceryByName,
    addGrocery,
    deleteGrocery,
    updateGrocery
}
