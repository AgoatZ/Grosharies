const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Grosharies:'+process.env.MONGO_ATLAS_PASS+'@grosharies.glcd8.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!'))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
