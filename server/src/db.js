const mongoose = require('mongoose');
let mongoUrl;
if (process.env.NODE_ENV == "production") {
    mongoUrl = process.env.MONGO_ATLAS_URL;
}
else if (process.env.NODE_ENV == "development") {
    mongoUrl = process.env.MONGO_LOCAL_URL;
}
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully!'))
    .catch(() => console.log('Unable to connect to database'));

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
