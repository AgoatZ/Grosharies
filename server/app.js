const { app, http } = require('./index');

const port = process.env.PORT || 5000;
const server = http.listen(port, () => {
    console.log(`Server is running \nlistening on port ${port}...`);
});
