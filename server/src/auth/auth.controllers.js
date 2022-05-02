const AuthService = require('./auth.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sendError = (res, code, message) => {
    return res.status(code).send({
        'status': 'fail',
        'error': message
    });
};

const register = async (req,res) => {
    try {
        const newUser = await AuthService.register(req.body);
        return res.status(200).json({ user: newUser, message: "Succesfully user registered" });
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};

const login = async (req, res) => {
    try {
        console.log('login');
        const accessToken = await AuthService.login(req.body.emailAddress, req.body.password, req.body.source);
        console.log(req.cookies);
        return res.status(200).send({'accessToken': accessToken});
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};

const jwtSign = async (req, res) => {
    try {
        console.log('jwtSign');
        const accessToken = await AuthService.jwtSign(req.user._id, req.user.userType);
        console.log(req.cookies);
        return res.status(200).send({message: 'Connected successfully'});
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};

const logout = async (req,res) => {
    req.user = null;
    res.redirect('./api/auth/login');
};

module.exports = {
    login,
    register,
    logout,
    jwtSign
};