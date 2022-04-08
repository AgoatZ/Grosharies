const jwt = require('jsonwebtoken');
const authenticate = async (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
    console.log('TOKEN: ' + token);
    console.log('HEADERS: ' + authHeaders);
    if(token == null){
        return res.status(401).send();
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) {
            return res.status(403).send(err.message);
        }
        req.user = user;
        next();
    });
};

module.exports = authenticate;