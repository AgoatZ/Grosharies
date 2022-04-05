const User = require('../user/user.model');
const Post = require('../post/post.model');
const Event = require('../event/event.model');
const Grocery = require('../grocery/grocery.model');
const Category = require('../category/category.model');
const Tag = require('../tag/tag.model');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/grosharies',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!')).then(() => init())
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

const init = () => {
    for(let i=0; i<10 ; i++) {
        let user = new User({
            "firstName": "Jacob" + i,
            "lastName": "Padre" + i,
            "emailAddress": "jacob" + i + "@yahoo.com",
            "password": "123456",
            "phone": "052373555" + i
        });
        user.save().then(dbUser => {

        let post = new Post({
            "headline": "A Post " + i,
            "userId": dbUser._id,
            "address": '' + i + " Nowhere Street",
            "pickUpDates": {
                "from": Date.now(),
                "until": Date.now()
            },
            "status": "collected"
        });
        post = post.save();

        let event = new Event({
            "headline": "An Event " + i,
            "userId": dbUser._id,
            "address": '' + i + " Nowhere Boulevard",
            "happeningDates": {
                "from": Date.now(),
                "until": Date.now()
            },
            "status": "ongoing"
        });
        event = event.save();
    });
        let tag = new Tag({
            "name": "General Tag " + i
        });
        tag = tag.save();

        let category = new Category({
            "name": "General Category " + i
        });
        category.save().then(cat => {
        console.log("cat:  "+cat);
        let grocery = new Grocery({
            "name": "Random Grocery " + i,
            "amount": i,
            "scale": "kg",
            "packing": "can",
            "category": cat._id
        });
        grocery = grocery.save();
    });
    }
}