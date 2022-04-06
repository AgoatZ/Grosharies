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
    const email = req.body.email;
    const password = req.body.password;

    try {
        const exists = await AuthService.getUserByEmail(email);
        if (exists != null) {
            return sendError(res, 400, 'user already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPwd = await bcrypt.hash(password, salt);

            let user = req.body;
            user.password = hashPwd;
            newUser = await AuthService.addUser(user);
            res.status(200).send(newUser);
        }
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};

const login = async (req, res) => {
    console.log('login');
    const email = req.body.emailAddress;
    const password = req.body.password;

    if(email == null || password == null) {
        return sendError(res, 400, 'wrong email or password');
    }

    try{
        const user = await AuthService.getUserByEmail(email);
        if(user == null) {
            return sendError(res, 400, 'wrong email or password');
        }
        console.log(user._id);
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return sendError(res, 400, 'wrong email or password');
        }

        const accessToken = await jwt.sign(
            {'id': user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.JWT_TOKEN_EXPIRATION}
        );
        res.status(200).send({'accessToken': accessToken});
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
    logout
};