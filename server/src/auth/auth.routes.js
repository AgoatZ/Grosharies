const express = require('express');
const { status } = require('express/lib/response');
const AuthController = require('./auth.controllers');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

module.exports = router;