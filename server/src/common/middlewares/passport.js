const passport = require('passport');
const User = require('.././../user/user.services');
const FederatedCredential = require('.././../federated-credential/federated-credential.services');
const GoogleStrategy = require('passport-google-oidc');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt_token'];
    }
    return token;
};

var opts = {}
opts.jwtFromRequest = cookieExtractor;
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
            console.log('passgoogle');
        var credentials = await FederatedCredential.getFederatedCredentialByProviderAndSubject(issuer, profile.id);
        console.log('credentials:', credentials);
        if (!credentials) {
            console.log('if not credentials, profile:', profile);
            var newUser = {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                emailAddress: profile.emails[0].value,
                password: "123456",
                phone: "052373555",
                source: "google"
            };
            newUser = await User.addGoogleUser(newUser);
            console.log(newUser);
            credentials = await FederatedCredential.addFederatedCredential(newUser._id, issuer, profile.id);
            return cb(null, newUser);
        } else {
            const user = await User.getUserById(credentials.userId);
            if (!user) {
                return cb(null, false);
            } else {
                return cb(null, user);
            }
          }
        } catch (e) {
            return cb(e);
        }
    }
));

const authGoogle = passport.authenticate("google", { scope: ["profile", "email"] });
const authGoogleCallback = passport.authenticate("google", {
      failureRedirect: "/",
      successRedirect: "/api/auth/google/ga",
    //   failureFlash: true,
    //   successFlash: "Successfully logged in!",
    });

const serializeUser = passport.serializeUser((user, done) => {
    done(null, user.id);
});
      
const deserializeUser = passport.deserializeUser(async (id, done) => {
    const currentUser = await User.getUserById(id);
    done(null, currentUser);
});

module.exports = {
    authJwt,
    authGoogle,
    authGoogleCallback,
    serializeUser,
    deserializeUser
};