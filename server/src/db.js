const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_ATLAS_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!'))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
