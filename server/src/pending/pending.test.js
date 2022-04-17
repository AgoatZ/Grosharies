const app = require('../../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('../../index');
const Pending = require('./pending.model');
const Status = require('../enums/pendingStatus');
const Scale = require('../enums/scale');
const Packing = require('../enums/packing');

const headline = 'Test Pending';
const userId = '62449a58c487bf4f38fbca59';
const address = 'NowhereTest 666';
const pickUpDates = {
        "from": "03/30/2022",
        "until": "03/30/2022"
    };

beforeAll(done=>{
    Pending.remove({ 'headline' : headline }, (err)=>{});
    for(i=0; i<5; i++) {
        Pending.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Pending.remove({ 'headline' : headline + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Pending.remove({ 'headline' : headline }, (err)=>{});
    for(i=0; i<5; i++) {
        Pending.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Pending.remove({ 'headline' : headline + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Pending API',()=>{
    let newPending;

    test('add new pending test',async ()=>{
        const response = await request(app).post('/api/pendings')
        .send({
                "headline": headline,
                "collectorId": userId,
                "publisherId": userId,
                "address": address,
                "status": Status.COLLECTED,
                "content": [
                    {
                        "name": "Tomato",
                        "amount": 9,
                        "scale": Scale.UNIT,
                        "packing": Packing.PAPER_BAG,
                        "category": "62471b06d433f84670e0c6e4"
                    },
                    {
                        "name": "Melon",
                        "amount": 5,
                        "scale": Scale.KILOGRAM,
                        "packing": Packing.PAPER_BOX,
                        "category": "623eed4e4a8a7d3c88258479"
                    }
                ]
        });
        expect(response.statusCode).toEqual(200);
        newPost = response.body.post;
        expect(newPost.headline).toEqual(headline);
        expect(newPost.address).toEqual(address);
        expect(newPost.status).toEqual(Status.COLLECTED);
    });

    test('get pending by id test', async () => {
        const response = await request(app).get('/api/pendings/' + newPost._id);
        expect(response.statusCode).toEqual(200);
        const post = response.body.post;
        expect(post._id).toEqual(newPost._id);
        expect(post.headline).toEqual(headline);
        expect(post.address).toEqual(address);
        expect(post.status).toEqual(Status.COLLECTED);
    });

    test('get all pendings test', async () => {
        const response = await request(app).get('/api/pendings');
        const posts = response.body.posts;
        expect(posts.length).toBeGreaterThanOrEqual(1);
    });

    test('update pending test', async () => {
        const response = await request(app).put('/api/pendings/' + newPost._id)
        .send({
                "headline": headline + 'update',
                "collectorId": userId,
                "publisherId": userId,
                "address": address + 'update',
                "status": Status.CANCELLED,
                "content": [
                    {
                        "name": "Tomato",
                        "amount": 5,
                        "scale": Scale.UNIT,
                        "packing": Packing.PAPER_BAG,
                        "category": "62471b06d433f84670e0c6e4"
                    },
                    {
                        "name": "Melon",
                        "amount": 2,
                        "scale": Scale.KILOGRAM,
                        "packing": Packing.PAPER_BOX,
                        "category": "623eed4e4a8a7d3c88258479"
                    }
                ]
        });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/pendings/' + newPost._id);
        const updatedPost = response2.body.post;
        expect(updatedPost._id).toEqual(newPost._id);
        expect(updatedPost.headline).toEqual(headline + 'update');
        expect(updatedPost.address).toEqual(address + 'update');
        expect(updatedPost.status).toEqual(Status.CANCELLED);
    });

    test('get pendings by user test', async ()=> {
        for(i=0; i<5; i++) {
            const response = await request(app).post('/api/pendings').send({
                "headline": headline + i,
                "collectorId": userId,
                "publisherId": userId,
                "address": address,
                "status": Status.COLLECTED,
                "tags": "623ef26d9945413bb822b12a",
                "content": [
                    {
                        "name": "Tomato",
                        "amount": 9,
                        "scale": Scale.UNIT,
                        "packing": Packing.PAPER_BAG,
                        "category": "62471b06d433f84670e0c6e4"
                    },
                    {
                        "name": "Melon",
                        "amount": 5,
                        "scale": Scale.KILOGRAM,
                        "packing": Packing.PAPER_BOX,
                        "category": "623eed4e4a8a7d3c88258479"
                    }
                ]
            });
        }
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/pendings/?user=' + userId);
        expect(response2.statusCode).toEqual(200);
        const postsByUser = response2.body.posts;
        expect(postsByUser.length).toBeGreaterThanOrEqual(5);
    });

    test('get pendings by category test', async () => {
        const response = await request(app).get('/api/pendings/?category=' + "623eed4e4a8a7d3c88258479");
        expect(response.statusCode).toEqual(200);
        const postsByCategory = response.body.posts;
        expect(postsByCategory.length).toBeGreaterThanOrEqual(5);   
    });

    test('get pendings by tag test', async () => {
        const response = await request(app).get('/api/pendings/?tag=' + "623ef26d9945413bb822b12a");
        expect(response.statusCode).toEqual(200);
        const postsByTag = response.body.posts;
        expect(postsByTag.length).toBeGreaterThanOrEqual(5);
    });
});