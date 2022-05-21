const express = require('express');
const AuthController = require('./auth.controllers');
const router = express.Router();
const passportMiddlewares = require('../common/middlewares/passport');
const { authJwt } = require('../common/middlewares/passport');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/isLoggedIn', authJwt, AuthController.isLoggedIn);

router.get('/login/federated/google', passportMiddlewares.authGoogle);

router.get('/google', passportMiddlewares.authGoogleCallback);

router.get('/google/sign', AuthController.jwtSign);

router.post('/logout', AuthController.logout);

module.exports = router;