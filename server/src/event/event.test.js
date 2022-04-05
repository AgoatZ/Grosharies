const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Event = require('./event.model');
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
    for(i=0; i<5; i++) {
        Event.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Event.remove({ 'headline' : headline + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Event.remove({ 'headline' : headline }, (err)=>{});
    for(i=0; i<5; i++) {
        Event.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Event.remove({ 'headline' : headline + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Event API',()=>{

    test('add new event, get event by id, get all events',async ()=>{
        const response = await request(app).post('/api/events')
        .send({
                "headline": headline,
                "userId": userId,
                "address": address,
                "happeningDates": happeningDates,
                "status": Status.ONGOING
        });
        expect(response.statusCode).toEqual(200);
        const newEvent = response.body.event;
        expect(newEvent.headline).toEqual(headline);
        expect(newEvent.userId).toEqual(userId);
        expect(newEvent.address).toEqual(address);
        expect(Date.parse(newEvent.happeningDates[0].from)).toEqual(Date.parse(happeningDates.from));
        expect(Date.parse(newEvent.happeningDates[0].until)).toEqual(Date.parse(happeningDates.until));
        expect(newEvent.status).toEqual(Status.ONGOING);
        
        const response2 = await request(app).get('/api/events/' + newEvent._id);
        expect(response2.statusCode).toEqual(200);
        const event2 = response2.body.event;
        expect(event2._id).toEqual(newEvent._id);
        expect(event2.headline).toEqual(headline);
        expect(event2.userId).toEqual(userId);
        expect(event2.address).toEqual(address);
        expect(Date.parse(event2.happeningDates[0].from)).toEqual(Date.parse(happeningDates.from));
        expect(Date.parse(event2.happeningDates[0].until)).toEqual(Date.parse(happeningDates.until));
        expect(event2.status).toEqual(Status.ONGOING);

        const response3 = await request(app).get('/api/events');
        const events = response3.body.events;
        expect(events.length).toBeGreaterThanOrEqual(1);

        const response4 = await request(app).post('/api/events/' + newEvent._id)
        .send({
                "headline": headline + 'update',
                "userId": userId,
                "address": address + 'update',
                "happeningDates": happeningDates,
                "status": Status.FUTURE
        });
        expect(response4.statusCode).toEqual(200);
        const response5 = await request(app).get('/api/events/' + newEvent._id);
        const updatedEvent = response5.body.event;
        expect(updatedEvent._id).toEqual(newEvent._id);
        expect(updatedEvent.headline).toEqual(headline + 'update');
        expect(updatedEvent.userId).toEqual(userId);
        expect(updatedEvent.address).toEqual(address + 'update');
        expect(Date.parse(updatedEvent.happeningDates[0].from)).toEqual(Date.parse(happeningDates.from));
        expect(Date.parse(updatedEvent.happeningDates[0].until)).toEqual(Date.parse(happeningDates.until));
        expect(updatedEvent.status).toEqual(Status.FUTURE);
    });

    test('get events by user and tag test', async ()=> {
        for(i=0; i<5; i++) {
        const response = await request(app).post('/api/events').send({
                "headline": headline + i,
                "userId": userId,
                "address": address,
                "happeningDates": happeningDates,
                "status": Status.ONGOING,
                "tags": "623ef26d9945413bb822b12a"
            });
        }
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/events/?user=' + userId);
        expect(response2.statusCode).toEqual(200);
        const eventsByUser = response2.body.events;
        expect(eventsByUser.length).toBeGreaterThanOrEqual(5); 
        
        const response3 = await request(app).get('/api/events/?tag=' + "623ef26d9945413bb822b12a");
        expect(response3.statusCode).toEqual(200);
        const eventsByTag = response3.body.events;
        expect(eventsByTag.length).toBeGreaterThanOrEqual(5);
    });

});