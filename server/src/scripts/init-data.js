const User = require('../user/user.model');
const Post = require('../post/post.model');
const Event = require('../event/event.model');
const Grocery = require('../grocery/grocery.model');
const Category = require('../category/category.model');
const Tag = require('../tag/tag.model');
const Pending = require('../pending/pending.model');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/grosharies',{ useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('connected', () => console.log('Database connected successfully for db:init')).then(() => init()).finally(() => mongoose.disconnect().then(() => console.log('Database disconnected successfully!')))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

const init = async () => {
    for(let i=0; i<10 ; i++) {
        try {
            let user = new User({
                "firstName": "Jacob" + i,
                "lastName": "Padre" + i,
                "emailAddress": "jacob" + i + "@yahoo.com",
                "password": "123456",
                "phone": "052373555" + i
            });
            user = await user.save();
            
            let tag = new Tag({
                "name": "General Tag " + i
            });
            tag = await tag.save();
        
            let category = new Category({
                "name": "General Category " + i
            });
            category = await category.save();

            let bananas = new Grocery({
                "name": "Bananas " + i,
                "amount": i,
                "scale": "kg",
                "packing": "can",
                "category": category._id
            });
            bananas = await bananas.save();
            let melonas = new Grocery({
                "name": "Melonas " + i,
                "amount": i,
                "scale": "kg",
                "packing": "can",
                "category": category._id
            });
            melonas = await melonas.save();

            let post = new Post({
                "headline": "A Post " + i,
                "userId": user._id,
                "address": '' + i + " Nowhere Street",
                "pickUpDates": {
                    "from": Date.now(),
                    "until": Date.now()
                },
                "status": "still there",
                "content": [
                    {
                        "name": "Bananas " + i,
                        "amount": i+10,
                        "scale": "kg",
                        "packing": "paper bag",
                        "category": category._id
                    },
                    {
                        "name": "Melonas " + i,
                        "amount": i+14,
                        "scale": "unit",
                        "packing": "none",
                        "category": category._id
                    }
                ]
            });
            post = await post.save();

            let pending = new Pending({
                "headline": post.headline,
                "address": post.address,
                "content": {
                    "name": "Bananas " + i,
                    "amount": i+3,
                    "scale": "kg",
                    "packing": "paper bag",
                    "category": category._id
                },
                "sourcePost": post._id,
                "publisherId": user._id,
                "collectorId": user._id,
                "status": "pending",
                "pendingTime": { 
                    "from": Date.now(),
                    "until": Date.now() + 60*60*1000
                }
            });
            pending = await pending.save()
            await user.update({
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
                    "until": Date.now()
                },
                "status": "ongoing"
            });
            event = await event.save();

        } catch(err) {console.log(err)}
    }
}