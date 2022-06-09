const User = require('../user/user.model');
const Post = require('../post/post.model');
const Event = require('../event/event.model');
const Grocery = require('../grocery/grocery.model');
const Category = require('../category/category.model');
const Tag = require('../tag/tag.model');
const Pending = require('../pending/pending.model');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const packing = require('../enums/packing');
const packs = Object.values(packing);
let a = path.resolve("src/imgs").split('\\');

let folderPath = '';
a.splice(a.length - 1, 1);
a.forEach(element => {
    folderPath += element + '\\'
});

console.log(folderPath);
const imgsFolderPath = path.join(folderPath, 'common', 'imgs');
const oneDay = 24 * 60 * 60 * 1000;
const oneHour = oneDay / 24;

mongoose.connect('mongodb://127.0.0.1:27017/grosharies', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('connected', () => console.log('Database connected successfully for db:init'))
    .then(() => init())
    .finally(() => mongoose.disconnect()
        .then(() => console.log('Database disconnected successfully!')))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

const init = async () => {
    try {
        await mongoose.connection.dropDatabase();
        let healthy = new Tag({
            "name": "Healthy"
        });
        healthy = await healthy.save();

        let tasty = new Tag({
            "name": "Tasty"
        });
        tasty = await tasty.save();

        let ecoFriendly = new Tag({
            "name": "Eco Friendly"
        });
        ecoFriendly = await ecoFriendly.save();

        let fairTrade = new Tag({
            "name": "Fair Trade"
        });
        fairTrade = await fairTrade.save();

        let plasticReduction = new Tag({
            "name": "Plastic Reduction"
        });
        plasticReduction = await plasticReduction.save();

        let sharingIsCaring = new Tag({
            "name": "Sharing is Caring"
        });
        sharingIsCaring = await sharingIsCaring.save();


        let fruits = new Category({
            "name": "Fruits"
        });
        fruits = await fruits.save();

        let vegetables = new Category({
            "name": "Vegetables"
        });
        vegetables = await vegetables.save();

        let hotMeals = new Category({
            "name": "Hot Meals"
        });
        hotMeals = await hotMeals.save();

        let fastFood = new Category({
            "name": "Fast Food"
        });
        fastFood = await fastFood.save();

        let dryFood = new Category({
            "name": "Dry Food"
        });
        dryFood = await dryFood.save();

        let junkFood = new Category({
            "name": "Junk Food"
        });
        junkFood = await junkFood.save();

        let beverages = new Category({
            "name": "Beverages"
        });
        beverages = await beverages.save();

        let alcohol = new Category({
            "name": "Alcohol"
        });
        alcohol = await alcohol.save();

        let rawFood = new Category({
            "name": "Raw Food"
        });
        rawFood = await rawFood.save();

        let meat = new Category({
            "name": "Meat"
        });
        meat = await meat.save();

        let sweets = new Category({
            "name": "Sweets"
        });
        sweets = await sweets.save();

        const gross = ['Bananas', 'Melonas', 'Off Bagril', 'Pommes', 'Orange Juice', 'Beer', 'Toblerone', 'Lindt Lindor', 'Raw Cocoa', 'Schnitzel', 'Rice'];
        const grMod = [];
        const cats = [fruits, fruits, meat, junkFood, beverages, alcohol, sweets, sweets, rawFood, meat, dryFood];
        const desc = ['Just passed by the all mighty Yochananof and saw about a few goodies left alone and ready to be eaten!',
            'So I have got lots of fresh fruits right from the tree waiting for whoever fancy some Sukariyot Teva, as the beloved by all - Sportacus - used to say...',
            'Last call for you all, we have got left just a few more boxes of really good food. It will be a shame to throw it all so please come by and take as much as you want.',
            'Like every sunday, we offer the best cooked meals that you can possibly image, on the house! we also have some natural, raw stuff that you might enjoy',
            'Zu verschenken! Wir ziehen aus und alles muss weg. Da gibt es Arbeitsmittel aber sehr lecker Essen auch!'];
        const imgPaths = [
            path.join(imgsFolderPath, 'bananas.png'),
            path.join(imgsFolderPath, 'melonas.webp'),
            path.join(imgsFolderPath, 'offbagril.jpg'),
            path.join(imgsFolderPath, 'pommes.jpg'),
            path.join(imgsFolderPath, 'orangejuice.jpg'),
            path.join(imgsFolderPath, 'beer.jfif'),
            path.join(imgsFolderPath, 'toblerone.jfif'),
            path.join(imgsFolderPath, 'lindtlindor.jfif'),
            path.join(imgsFolderPath, 'rawcocoa.jfif'),
            path.join(imgsFolderPath, 'schnitzel.jpg'),
            path.join(imgsFolderPath, 'rice.jpg')
        ];
        const postImgPaths = [
            path.join(imgsFolderPath, 'rewe1.webp'),
            path.join(imgsFolderPath, 'rewe2.jpg'),
            path.join(imgsFolderPath, 'jochananof1.jpeg'),
            path.join(imgsFolderPath, 'jochananof2.jpg'),
            path.join(imgsFolderPath, 'edeka1.webp'),
            path.join(imgsFolderPath, 'edeka2.jpg'),
            path.join(imgsFolderPath, 'aldi1.jpg'),
            path.join(imgsFolderPath, 'aldi2.jpg')
        ];

        const groImages = [];
        for (let i = 0; i < 11; i++) {
            let img = fs.readFileSync(imgPaths[i], "base64");
            let catId = cats[i]._id;
            let grocery = new Grocery({
                "name": gross[i],
                "amount": i,
                "scale": "kg",
                "packing": packs[i % 10],
                "category": catId,
                "images": img
            });
            grocery = await grocery.save();
            let category = await Category.findById(catId);
            let categoryGroceries = category.groceries;
            categoryGroceries.push(grocery._id);
            await Category.findByIdAndUpdate(catId, { groceries: categoryGroceries });
            groImages.push(img.toString());
        };

        for (let i = 0; i < 30; i++) {
            let user = new User({
                "firstName": "Jacob" + i,
                "lastName": "Padre" + i,
                "emailAddress": "jacob" + i + "@yahoo.com",
                "password": "$2b$10$Pw7tfDk.69gJxZwCdu2/POZ6fG8eDjVEikJxA5evaLUk9zOgtoNky",
                "phone": "052373555" + i,
                "source": "grosharies"
            });
            await user.save();

            let useress = new User({
                "firstName": "Dolores" + i,
                "lastName": "Soledad" + i,
                "emailAddress": "dolores" + i + "@web.de",
                "password": "$2b$10$Pw7tfDk.69gJxZwCdu2/POZ6fG8eDjVEikJxA5evaLUk9zOgtoNky",
                "phone": "052373666" + i,
                "source": "grosharies"
            });
            await useress.save();

            let postImg1 = fs.readFileSync(postImgPaths[i % 6], "base64");
            let postImg2 = fs.readFileSync(postImgPaths[(i + 1) % 6], "base64");
            let useressPost = {
                "headline": "Come and take some " + gross[i % 11],
                "userId": useress._id,
                "address": '' + (i + 1) + " King George, Tel Aviv",
                "pickUpDates": {
                    "from": Date.now(),
                    "until": Date.now() + oneDay
                },
                "status": "still there",
                "content": [
                    {
                        "original": {
                            "name": gross[i % 11],
                            "amount": i + 10,
                            "scale": "kg",
                            "packing": packs[i % 10],
                            "category": cats[i % 11]._id,
                            "images": groImages[i % 11]
                        },
                        "left": i + 10
                    },
                    {
                        "original": {
                            "name": gross[(i + 1) % 11],
                            "amount": i + 14,
                            "scale": "unit",
                            "packing": packs[(i + 1) % 10],
                            "category": cats[(i + 1) % 11]._id,
                            "images": groImages[(i + 1) % 11]
                        },
                        "left": i + 14
                    },
                    {
                        "original": {
                            "name": gross[(i + 2) % 11],
                            "amount": i + 14,
                            "scale": "unit",
                            "packing": packs[(i + 2) % 10],
                            "category": cats[(i + 2) % 11]._id,
                            "images": groImages[(i + 2) % 11]
                        },
                        "left": i + 14
                    },
                    {
                        "original": {
                            "name": gross[(i + 3) % 11],
                            "amount": i + 14,
                            "scale": "unit",
                            "packing": packs[(i + 3) % 10],
                            "category": cats[(i + 3) % 11]._id,
                            "images": groImages[(i + 3) % 11]
                        },
                        "left": i + 14
                    },
                    {
                        "original": {
                            "name": gross[(i + 4) % 11],
                            "amount": i + 14,
                            "scale": "unit",
                            "packing": packs[(i + 4) % 10],
                            "category": cats[(i + 4) % 11]._id,
                            "images": groImages[(i + 4) % 11]
                        },
                        "left": i + 14
                    }
                ],
                "images": [
                    postImg1,
                    postImg2
                ],
                "description": desc[i % 5]
            };
            let userPost = JSON.parse(JSON.stringify(useressPost));
            userPost.userId = user._id;
            let post1 = new Post(useressPost);
            useressPost.headline = "Come and take some " + gross[9];
            let post2 = new Post(useressPost);
            useressPost.headline = "Come and take some " + gross[2];
            let post3 = new Post(useressPost);
            useressPost.headline = "Come and take some " + gross[3];
            let post4 = new Post(useressPost);
            useressPost.headline = "Come and take some " + gross[4];
            let post5 = new Post(useressPost);
            if (i < 3) {
                post1 = await post1.save();
                post2 = await post2.save();
                post3 = await post3.save();
                post4 = await post4.save();
                post5 = await post5.save();
                await useress.updateOne({ posts: [post1._id, post2._id, post3._id, post4._id, post5._id] });
            }
            else {
                let post1 = new Post(userPost);
                userPost.header = "Come and take some " + gross[6];
                let post2 = new Post(userPost);
                post1 = await post1.save();
                post2 = await post2.save();
                await user.updateOne({ posts: [post1._id, post2._id] });
            }

            let publisherId;
            let collectorId;
            if (i < 3) {
                publisherId = useress._id;
                collectorId = user._id;
            } else {
                publisherId = user._id;
                collectorId = useress._id;
            }
            let pending = new Pending({
                "headline": post1.headline,
                "address": post1.address,
                "content": {
                    "name": gross[i % 11],
                    "amount": i + 3,
                    "scale": "kg",
                    "packing": packs[i % 10],
                    "category": cats[i % 11]._id
                },
                "sourcePost": post1._id,
                "publisherId": publisherId,
                "collectorId": collectorId,
                "status": "pending",
                "pendingTime": {
                    "from": Date.now(),
                    "until": Date.now() + oneHour
                }
            });
            pending = await pending.save()
            if (i < 3) {
                await user.updateOne({ collectedHistory: pending._id });
            } else {
                await useress.updateOne({ collectedHistory: pending._id });
            }
            let event = new Event({
                "headline": "An Event " + i,
                "userId": user._id,
                "address": '' + i + " Nowhere Boulevard",
                "happeningDates": {
                    "from": Date.now(),
                    "until": Date.now() + oneDay
                },
                "status": "ongoing"
            });
            event = await event.save();
        }
    } catch (err) { console.log(err) }
}