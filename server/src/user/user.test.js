const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const User = require('./user.model');
const AccountType = require('../enums/userType');

const firstName = 'Test First Name';
const lastName = 'Test Last Name';
const emailAddress = 'test@mail.com';
const phone = '0523666666';

beforeAll(done=>{
    User.remove({ 'emailAddress' : emailAddress }, (err)=>{
        done();
    });
});

afterAll(done=>{
    User.remove({ 'emailAddress' : emailAddress }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing User API',()=>{

    test('add new user, get user by id, get all users',async ()=>{
        const response = await request(app).post('/api/users')
        .send({
                "firstName": firstName,
                "lastName": lastName,
                "emailAddress": emailAddress,
                "phone": phone
        });
        expect(response.statusCode).toEqual(200);
        const newUser = response.body.user;
        expect(newUser.firstName).toEqual(firstName);
        expect(newUser.lastName).toEqual(lastName);
        expect(newUser.emailAddress).toEqual(emailAddress);
        expect(newUser.phone).toEqual(phone);
        expect(newUser.accountType).toEqual(AccountType.USER);
        
        const response2 = await request(app).get('/api/users/' + newUser._id);
        expect(response2.statusCode).toEqual(200);
        const user2 = response2.body.user;
        expect(user2._id).toEqual(newUser._id);
        expect(user2.firstName).toEqual(firstName);
        expect(user2.lastName).toEqual(lastName);
        expect(user2.emailAddress).toEqual(emailAddress);
        expect(user2.phone).toEqual(phone);
        expect(user2.accountType).toEqual(AccountType.USER);

        const response3 = await request(app).get('/api/users');
        const users = response3.body.users;
        expect(users.length).toBeGreaterThanOrEqual(2);

        const response4 = await request(app).post('/api/users/' + newUser._id)
        .send({
            "firstName": firstName + 'update',
            "lastName": lastName + 'update',
            "accountType": AccountType.ADMIN
        });
        expect(response4.statusCode).toEqual(200);
        const response5 = await request(app).get('/api/users/' + newUser._id);
        const updatedUser = response5.body.user;
        expect(updatedUser._id).toEqual(newUser._id);
        expect(updatedUser.firstName).toEqual(firstName + 'update');
        expect(updatedUser.lastName).toEqual(lastName + 'update');
        expect(updatedUser.accountType).toEqual(AccountType.ADMIN);
    });

});