const passport = require('passport');
const User = require('.././../user/user.services'); 

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =  process.env.ACCESS_TOKEN_SECRET;
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    const user = await User.getUserById(jwt_payload.id);
    try {
        if (user) {
            console.log('USER RETURNED AND JWT PAYLOAD IS ',jwt_payload);
            return done(null, user);
        } else {
            console.log('RETURNED NULL AND JWT PAYLOAD IS ',jwt_payload);
            return done(null, false);
        }
    } catch (err) {
        throw Error(err);
    }
}));
const authJwt = passport.authenticate('jwt', { session: false });
module.exports = authJwt;