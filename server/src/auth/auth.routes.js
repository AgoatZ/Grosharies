const express = require('express');
const { status } = require('express/lib/response');
const AuthController = require('./auth.controllers');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const passportMiddlewares = require('../common/middlewares/passport');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/login/federated/google', passportMiddlewares.authGoogle);

router.get('/google', passportMiddlewares.authGoogleCallback);

router.get('/google/ga', (req,res) => {
    AuthController.login({ 
        //TODO: ONLY CONTROLLER ROUTE
        body: {
            emailAddress: req.user.emailAddress,
            password: req.user.password,
            source: req.user.source
        }
    }, res);
});

router.post('/logout', AuthController.logout);


module.exports = router;