const express = require('express');
const { status } = require('express/lib/response');
const UserRepository = require('../user/user.repository');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (user) => {
    try {
        const exists = await UserRepository.getUserByEmail(user.emailAddress);
        if (exists != null) {
            throw Error('user already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPwd = await bcrypt.hash(user.password, salt);

            user.password = hashPwd;
            newUser = await UserRepository.addUser(user);
            return newUser;
        }
    } catch (err) {
        throw Error(err);
    }
}

const login = async (email, password, source) => {
    if (email == null || password == null) {
        throw Error('wrong email or password1');
    }

    try {
//ADD SOURCE GROSHARIES AND EXCHANGE SWITCH WITH IF
        const user = await UserRepository.getUserByEmail(email);
        if (user == null) {
            throw Error('wrong email or password2');
        }
        switch (source) {
            case 'google': {
                break;
            }
            default:
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    console.log(password);
                    console.log(user.password);
                    throw Error('wrong email or password3');
                }
                break;
        }
//TODO: FINISH IT UP
        // const user = await UserRepository.getUserByEmail(email);
        // if(user == null) {
        //     throw Error('wrong email or password2');
        // }

        // const match = await bcrypt.compare(password, user.password);
        // if(!match) {
        //     console.log(password);
        //     console.log(user.password);
        //     throw Error('wrong email or password3');
        // }
        console.log('loginauth');
        const accessToken = await jwt.sign({
            'id': user._id,
            'role': user.userType
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );
        return accessToken;
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    register,
    login
};