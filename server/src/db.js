const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/grosharies',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!'))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
