const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Event = require('./event.model');
const User = require('../user/user.model');
const Status = require('../enums/eventStatus');

const headline = 'Test Event';
const userId = '62449a58c487bf4f38fbca59';
const address = 'NowhereTest 666';
const happeningDates = {
        "from": "03/30/2022",
        "until": "03/30/2022"
    };

beforeAll(done=>{
    Event.remove({ 'headline' : headline }, (err)=>{});
    User.remove({'emailAddress': 'test@test.com'}, (err) => {});
    for(i=0; i<5; i++) {
        Event.remove({'headline' : headline +''+ i}, (err)=>{});
    }
    Event.remove({ 'headline' : headline + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Event.remove({ 'headline' : headline }, (err)=>{});
    User.remove({'emailAddress': 'test@test.com'}, (err) => {});
    for(i=0; i<5; i++) {
        Event.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Event.remove({ 'headline' : headline + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Event API', () => {
    let newEvent;
    let accessToken;
    test('add new event test', async ()=> {

        const regResponse = await request(app).post('/api/auth/register').send({
            "firstName": "fake name",
            "lastName": "fake last",
            "emailAddress": "test@test.com",
            "password": "12345678",
            "phone": "0543212345"
        });
    
        const logResponse = await request(app).post('/api/auth/login').send({
            "emailAddress": "test@test.com",
            "password": "12345678"
        });
        accessToken = logResponse.body.accessToken;

        const response = await request(app).post('/api/events')
        .send({
                "headline": headline,
                "userId": userId,
                "address": address,
                "happeningDates": happeningDates,
                "status": Status.ONGOING
        });
        expect(response.statusCode).toEqual(200);
        newEvent = response.body.event;
        expect(newEvent.headline).toEqual(headline);
        expect(newEvent.userId).toEqual(userId);
        expect(newEvent.address).toEqual(address);
        expect(Date.parse(newEvent.happeningDates[0].from)).toEqual(Date.parse(happeningDates.from));
        expect(Date.parse(newEvent.happeningDates[0].until)).toEqual(Date.parse(happeningDates.until));
        expect(newEvent.status).toEqual(Status.ONGOING);
    });

    test('get event by id test', async () => {
        const response = await request(app).get('/api/events/' + newEvent._id);
        expect(response.statusCode).toEqual(200);
        const event = response.body.event;
        expect(event._id).toEqual(newEvent._id);
        expect(event.headline).toEqual(headline);
        expect(event.userId).toEqual(userId);
        expect(event.address).toEqual(address);
        expect(Date.parse(event.happeningDates[0].from)).toEqual(Date.parse(happeningDates.from));
        expect(Date.parse(event.happeningDates[0].until)).toEqual(Date.parse(happeningDates.until));
        expect(event.status).toEqual(Status.ONGOING);
    });

    test('get all events test', async () => {
        const response = await request(app).get('/api/events').set({ Authorization: 'barer '+accessToken });
        const events = response.body.events;
        expect(events.length).toBeGreaterThanOrEqual(1);
    });

    test('update event test', async () => {
        const response = await request(app).put('/api/events/' + newEvent._id)
        .send({
                "headline": headline + 'update',
                "userId": userId,
                "address": address + 'update',
                "happeningDates": happeningDates,
                "status": Status.FUTURE
        });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/events/' + newEvent._id);
        const updatedEvent = response2.body.event;
        expect(updatedEvent._id).toEqual(newEvent._id);
        expect(updatedEvent.headline).toEqual(headline + 'update');
        expect(updatedEvent.userId).toEqual(userId);
        expect(updatedEvent.address).toEqual(address + 'update');
        expect(Date.parse(updatedEvent.happeningDates[0].from)).toEqual(Date.parse(happeningDates.from));
        expect(Date.parse(updatedEvent.happeningDates[0].until)).toEqual(Date.parse(happeningDates.until));
        expect(updatedEvent.status).toEqual(Status.FUTURE);
    });

    test('get events by user test', async ()=> {
        for(i=0; i<5; i++) {
        const response = await request(app).post('/api/events')
        .send({
                "headline": headline + i,
                "userId": userId,
                "address": address,
                "happeningDates": happeningDates,
                "status": Status.ONGOING,
                "tags": "623ef26d9945413bb822b12a"
            });
        }
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/events/?user=' + userId).set({ Authorization: 'barer '+accessToken });
        expect(response2.statusCode).toEqual(200);
        const eventsByUser = response2.body.events;
        expect(eventsByUser.length).toBeGreaterThanOrEqual(5); 
    });

    test('get events by tag test', async ()=> {
        const response = await request(app).get('/api/events/?tag=' + "623ef26d9945413bb822b12a").set({ Authorization: 'barer '+accessToken });
        expect(response.statusCode).toEqual(200);
        const eventsByTag = response.body.events;
        expect(eventsByTag.length).toBeGreaterThanOrEqual(5);
    });

});