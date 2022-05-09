const User = require('../user/user.model');
const Post = require('../post/post.model');
const Event = require('../event/event.model');
const Grocery = require('../grocery/grocery.model');
const Category = require('../category/category.model');
const Tag = require('../tag/tag.model');
const Pending = require('../pending/pending.model');
const mongoose = require('mongoose');
const packing = require('../enums/packing');
const packs = [];
for (pack in packing) {
    packs.push(packing[pack]);
}
const oneDay = 24 * 60 * 60 * 1000;
const oneHour = oneDay / 24;

mongoose.connect('mongodb://127.0.0.1:27017/grosharies', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('connected', () => console.log('Database connected successfully for db:init')).then(() => init()).finally(() => mongoose.disconnect().then(() => console.log('Database disconnected successfully!')))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

const init = async () => {
    try {
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
        const cats = [fruits, fruits, meat, junkFood, beverages, alcohol, sweets, sweets, rawFood, meat, dryFood];
        const desc = ['Just passed by the all mighty Yochananof and saw about a few goodies left alone and ready to be eaten!',
            'So I have got lots of fresh fruits right from the tree waiting for whoever fancy some Sukariyot Teva, as the beloved by all - Sportacus - used to say...',
            'Last call for you all, we have got left just a few more boxes of really good food. It will be a shame to throw it all so please come by and take as much as you want.',
            'Like every sunday, we offer the best cooked meals that you can possibly image, on the house! we also have some natural, raw stuff that you might enjoy',
            'Zu verschenken! Wir ziehen aus und alles muss weg. Da gibt es Arbeitsmittel aber sehr lecker Essen auch!'];

        for (let i = 0; i < 30; i++) {
            let user = new User({
                "firstName": "Jacob" + i,
                "lastName": "Padre" + i,
                "emailAddress": "jacob" + i + "@yahoo.com",
                "password": "a1234567",
                "phone": "052373555" + i,
                "source": "grosharies"
            });
            user = await user.save();

            if (i < 11) {
                let grocery = new Grocery({
                    "name": gross[i % 11],
                    "amount": i,
                    "scale": "kg",
                    "packing": packs[i % 10],
                    "category": cats[i % 11]._id
                });
                grocery = await grocery.save();
            }

            let post = new Post({
                "headline": "Come and take some " + gross[i % 11],
                "userId": user._id,
                "address": '' + i + " Nowhere Street",
                "pickUpDates": {
                    "from": Date.now(),
                    "until": Date.now() + oneDay
                },
                "status": "still there",
                "content": [
                    {
                        "name": gross[i % 11],
                        "amount": i + 10,
                        "scale": "kg",
                        "packing": packs[i % 10],
                        "category": cats[i % 11]._id
                    },
                    {
                        "name": gross[Math.ceil(i / 2) % 11],
                        "amount": i + 14,
                        "scale": "unit",
                        "packing": packs[Math.ceil(i / 2) % 10],
                        "category": cats[i % 11]._id
                    }
                ],
                "description": desc[i % 5]
            });
            post = await post.save();

            let pending = new Pending({
                "headline": post.headline,
                "address": post.address,
                "content": {
                    "name": gross[i % 11],
                    "amount": i + 3,
                    "scale": "kg",
                    "packing": packs[i % 10],
                    "category": cats[i % 11]._id
                },
                "sourcePost": post._id,
                "publisherId": user._id,
                "collectorId": user._id,
                "status": "pending",
                "pendingTime": {
                    "from": Date.now(),
                    "until": Date.now() + oneHour
                }
            });
            pending = await pending.save()
            await user.updateOne({
                "firstName": "Jacob" + i,
                "lastName": "Padre" + i,
                "emailAddress": "jacob" + i + "@yahoo.com",
                "password": "123456",
                "phone": "052373555" + i,
                "collectedHistory": pending._id
            });

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