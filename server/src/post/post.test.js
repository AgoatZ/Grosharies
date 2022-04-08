const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Post = require('./post.model');
const Status = require('../enums/postStatus');
const Scale = require('../enums/scale');
const Packing = require('../enums/packing');

const headline = 'Test Post';
const userId = '62449a58c487bf4f38fbca59';
const address = 'NowhereTest 666';
const pickUpDates = {
        "from": "03/30/2022",
        "until": "03/30/2022"
    };

beforeAll(done=>{
    Post.remove({ 'headline' : headline }, (err)=>{});
    for(i=0; i<5; i++) {
        Post.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Post.remove({ 'headline' : headline + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Post.remove({ 'headline' : headline }, (err)=>{});
    for(i=0; i<5; i++) {
        Post.remove({'headline' : headline +''+ i}, (err)=>{})
    }
    Post.remove({ 'headline' : headline + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Post API',()=>{
    let newPost;

    test('add new post test',async ()=>{
        const response = await request(app).post('/api/posts')
        .send({
                "headline": headline,
                "userId": userId,
                "address": address,
                "pickUpDates": pickUpDates,
                "status": Status.COLLECTED
        });
        expect(response.statusCode).toEqual(200);
        newPost = response.body.post;
        expect(newPost.headline).toEqual(headline);
        expect(newPost.userId).toEqual(userId);
        expect(newPost.address).toEqual(address);
        expect(Date.parse(newPost.pickUpDates[0].from)).toEqual(Date.parse(pickUpDates.from));
        expect(Date.parse(newPost.pickUpDates[0].until)).toEqual(Date.parse(pickUpDates.until));
        expect(newPost.status).toEqual(Status.COLLECTED);
    });

    test('get post by id test', async () => {
        const response = await request(app).get('/api/posts/' + newPost._id);
        expect(response.statusCode).toEqual(200);
        const post = response.body.post;
        expect(post._id).toEqual(newPost._id);
        expect(post.headline).toEqual(headline);
        expect(post.userId).toEqual(userId);
        expect(post.address).toEqual(address);
        expect(Date.parse(post.pickUpDates[0].from)).toEqual(Date.parse(pickUpDates.from));
        expect(Date.parse(post.pickUpDates[0].until)).toEqual(Date.parse(pickUpDates.until));
        expect(post.status).toEqual(Status.COLLECTED);
    });

    test('get all posts test', async () => {
        const response = await request(app).get('/api/posts');
        const posts = response.body.posts;
        expect(posts.length).toBeGreaterThanOrEqual(1);
    });

    test('update post test', async () => {
        const response = await request(app).put('/api/posts/' + newPost._id)
        .send({
                "headline": headline + 'update',
                "userId": userId,
                "address": address + 'update',
                "pickUpDates": pickUpDates,
                "status": Status.PARTIALLY_COLLECTED
        });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/posts/' + newPost._id);
        const updatedPost = response2.body.post;
        expect(updatedPost._id).toEqual(newPost._id);
        expect(updatedPost.headline).toEqual(headline + 'update');
        expect(updatedPost.userId).toEqual(userId);
        expect(updatedPost.address).toEqual(address + 'update');
        expect(Date.parse(updatedPost.pickUpDates[0].from)).toEqual(Date.parse(pickUpDates.from));
        expect(Date.parse(updatedPost.pickUpDates[0].until)).toEqual(Date.parse(pickUpDates.until));
        expect(updatedPost.status).toEqual(Status.PARTIALLY_COLLECTED);
    });

    test('get posts by user test', async ()=> {
        for(i=0; i<5; i++) {
            const response = await request(app).post('/api/posts').send({
                "headline": headline + i,
                "userId": userId,
                "address": address,
                "pickUpDates": pickUpDates,
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
        const response2 = await request(app).get('/api/posts/?user=' + userId);
        expect(response2.statusCode).toEqual(200);
        const postsByUser = response2.body.posts;
        expect(postsByUser.length).toBeGreaterThanOrEqual(5);
    });

    test('get posts by category test', async () => {
        const response = await request(app).get('/api/posts/?category=' + "623eed4e4a8a7d3c88258479");
        expect(response.statusCode).toEqual(200);
        const postsByCategory = response.body.posts;
        expect(postsByCategory.length).toBeGreaterThanOrEqual(5);   
    });

    test('get posts by tag test', async () => {
        const response = await request(app).get('/api/posts/?tag=' + "623ef26d9945413bb822b12a");
        expect(response.statusCode).toEqual(200);
        const postsByTag = response.body.posts;
        expect(postsByTag.length).toBeGreaterThanOrEqual(5);
    });
});