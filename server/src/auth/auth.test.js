const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('mongoose');
const { response } = require('.././../index');
const User = require('../user/user.model');
const userApi = require('../user/user.routes');
const Authenticate = require('../common/middlewares/authentication');


const firstName = 'Test First Name';
const lastName = 'Test Last Name';
const emailAddress = 'test@mail.com';
const password = "12345678";
const phone = '0523666666';
let accessToken;

beforeAll(done=>{
    User.remove({'emailAddress' : emailAddress}, (err)=>{
        done()
    })
})

afterAll(done=>{
    User.remove({'emailAddress' : emailAddress}, (err)=>{
        mongoosse.connection.close()
        done()
    })
})


describe('Testing Auth API',()=>{

    test('test registration',async ()=>{
        const response = await request(app).post('/api/auth/register').send({
            "firstName": firstName,
            "lastName": lastName,
            "emailAddress": emailAddress,
            "password": password,
            "phone": phone
        });
        expect(response.statusCode).toEqual(200);
    });

    test('test login',async ()=>{
        const response = await request(app).post('/api/auth/login').send({
            "emailAddress": emailAddress,
            "password": password
        });
        accessToken = response.body.accessToken;
        console.log('ACCESSTOKEN IS: '+accessToken);
        expect(response.statusCode).toEqual(200);
    });

    test('test authentication', async ()=>{
        
        const response = await request(app).get('/api/tags').set({ Authorization: 'JWT '+accessToken });
        
        console.log('response from get events: '+response.body);
        expect(response.statusCode).toEqual(200);
    });
   
});