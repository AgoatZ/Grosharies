const passport = require('passport');
const User = require('.././../user/user.services');
const FederatedCredential = require('.././../federated-credential/federated-credential.services');
const GoogleStrategy = require('passport-google-oidc');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

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

passport.use(new GoogleStrategy({
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: [ 'profile' ]
    }, async function verify(issuer, profile, cb) {
        try {
        var credentials = await FederatedCredential.getFederatedCredentialByProviderAndSubject(issuer, profile.id);
        console.log('credentials:', credentials);
        if (!credentials) {
            const user = await User.addUser({ name: profile.displayName, password: " " });
            var id = this.lastID;
            credentials = await FederatedCredential.addFederatedCredential(id, issuer, profile.id);
            console.log('if not credentials, new credentials:', credentials);
            var newUser = {
                _id: id,
                firstName: profile.displayName,
                lastName: "google",
                emailAddress: profile.emailAddress,
                password: "123456",
                phone: "052373555"
            };
            newUser = await User.addGoogleUser(newUser);
            return cb(null, newUser);
        } else {
            const user = await User.getUserById(credentials.user_id);
            if (!user) {
                return cb(null, false);
            }
            return cb(null, user);
          }
        } catch (e) {
            return cb(e);
        }
    }
));
const authGoogle = passport.authenticate("google", { scope: ["profile", "email"] });
const authGoogleCallback = passport.authenticate("google", {
      failureRedirect: "/",
      successRedirect: "/",
      failureFlash: true,
      successFlash: "Successfully logged in!",
    });

module.exports = {
    authJwt,
    authGoogle,
    authGoogleCallback
};