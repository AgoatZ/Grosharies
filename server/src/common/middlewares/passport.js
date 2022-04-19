const passport = require('passport');
const User = require('.././../user/user.services'); 

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader('Authorization');
opts.secretOrKey =  process.env.ACCESS_TOKEN_SECRET;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('JWT PAYLOAD IS ',jwt_payload);
    User.getUserById( jwt_payload.id, function(err, user) {
        if (err) {
            console.log('JWT PAYLOAD IS ',jwt_payload);
            return done(err, false);
        }
        if (user) {
            console.log('JWT PAYLOAD IS ',jwt_payload);
            return done(null, user);
        } else {
            console.log('JWT PAYLOAD IS ',jwt_payload);
            return done(null, false);
            // or you could create a new account
        }
    });
}));
module.exports = {
    passport
};