const User = require('../user/user.model');
const Post = require('../post/post.model');
const Event = require('../event/event.model');
const Grocery = require('../grocery/grocery.model');
const Category = require('../category/category.model');
const Tag = require('../tag/tag.model');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/grosharies',{ useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('connected', () => console.log('Database connected successfully!!!!!!!!')).then(() => init()).finally(() => mongoose.disconnect().then(() => console.log('Database disconnected successfully!')))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

const init = async () => {
    let groceries = [];
    let posts = [];
    let events = [];
    let tags = [];
    for(let i=0; i<10 ; i++) {
        try {
        let user = new User({
            "firstName": "Jacob" + i,
            "lastName": "Padre" + i,
            "emailAddress": "jacob" + i + "@yahoo.com",
            "password": "123456",
            "phone": "052373555" + i
        });
        await user.save().then(dbUser => {

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
            posts[i] = post;

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
            events[i] = event;
        });
            let tag = new Tag({
                "name": "General Tag " + i
            });
            tags[i] = tag;
     
            let category = new Category({
                "name": "General Category " + i
            });
     
            category = await category.save();
            let grocery = new Grocery({
                "name": "Random Grocery " + i,
                "amount": i,
                "scale": "kg",
                "packing": "can",
                "category": category._id
            });
            groceries[i] = grocery;
        }
    catch(err) {console.log(err)}
    }

    
    for await(const g of groceries) {await g.save(); }
    for await(const t of tags) {await t.save(); }
    for await(const e of events) {await e.save(); }
    for await(const p of posts) {await p.save(); }
}

/*
const blabla = (isTrue) => new Promise((resolve, reject) => {
    if(isTrue) resolve('mashetirtze');
    else reject(); 
});
let myPromise = blabla(true);
myPromise.then((data) => console.log('succeed!', data))
.then(() => console.log('here'))
.catch((err) => console.log('fail!'));

const tryas = async () => {
    const retval = await blabla(true);
    myPromise = blabla(true);
    console.log()
}*/