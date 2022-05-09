const AuthService = require('./auth.services');

const sendError = (res, code, message) => {
    return res.status(code).send({
        'status': 'fail',
        'error': message
    });
};

const register = async (req, res) => {
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
        return res.status(200).send({ accessToken: accessToken, message: 'Connected successfully' });
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};

const jwtSign = async (req, res) => {
    try {
        const accessToken = await AuthService.jwtSign(req.user._id, req.user.userType);
        return res.status(200).send({ accessToken: accessToken, message: 'Connected successfully' });
    } catch (err) {
        return sendError(res, 400, err.message);
    }
};

const isLoggedIn = async (_, res) => {
    return res.status(200).send({ loggedIn: true });
};

const logout = async (req, res) => {
    req.user = null;
    res.redirect('./api/auth/login');
};

module.exports = {
    login,
    register,
    logout,
    jwtSign,
    isLoggedIn
};