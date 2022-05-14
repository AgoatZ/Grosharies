const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const User = require('./user.model');
const AccountType = require('../enums/userType');

const firstName = 'Test First Name';
const lastName = 'Test Last Name';
const emailAddress = 'test@mail.com';
const password = "12345678";
const phone = '0523666666';

beforeAll(done => {
    User.remove({ 'emailAddress': emailAddress }, (err) => {
        done();
    });
});

afterAll(done => {
    User.remove({ 'emailAddress': emailAddress }, (err) => {
        mongoosse.connection.close();
        done();
    });
});


describe('Testing User API', () => {
    let newUser;

    test('add new user', async () => {
        const response = await request(app).post('/api/users')
            .send({
                "firstName": firstName,
                "lastName": lastName,
                "emailAddress": emailAddress,
                "password": password,
                "phone": phone
            });
        expect(response.statusCode).toEqual(200);
        newUser = response.body.user;
        expect(newUser.firstName).toEqual(firstName);
        expect(newUser.lastName).toEqual(lastName);
        expect(newUser.emailAddress).toEqual(emailAddress);
        expect(newUser.phone).toEqual(phone);
        expect(newUser.accountType).toEqual(AccountType.USER);
    });

    test('get user by id', async () => {
        const response = await request(app).get('/api/users/' + newUser._id);
        expect(response.statusCode).toEqual(200);
        const user = response.body.user;
        expect(user._id).toEqual(newUser._id);
        expect(user.firstName).toEqual(firstName);
        expect(user.lastName).toEqual(lastName);
        expect(user.emailAddress).toEqual(emailAddress);
        expect(user.phone).toEqual(phone);
        expect(user.accountType).toEqual(AccountType.USER);
    });

    test('get all users', async () => {
        const response = await request(app).get('/api/users');
        const users = response.body.users;
        expect(users.length).toBeGreaterThanOrEqual(1);
    });

    test('update user', async () => {
        const response = await request(app).put('/api/users/' + newUser._id)
            .send({
                "firstName": firstName + 'update',
                "lastName": lastName + 'update',
                "accountType": AccountType.ADMIN
            });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/users/' + newUser._id);
        const updatedUser = response2.body.user;
        expect(updatedUser._id).toEqual(newUser._id);
        expect(updatedUser.firstName).toEqual(firstName + 'update');
        expect(updatedUser.lastName).toEqual(lastName + 'update');
        expect(updatedUser.accountType).toEqual(AccountType.ADMIN);
    });
});