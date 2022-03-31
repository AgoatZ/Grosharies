const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Post = require('./post.model');
const Status = require('../enums/postStatus');

const headline = 'Test Post';
const userId = '62449a58c487bf4f38fbca59';
const address = 'NowhereTest 666';
const pickUpDates = {
        "from": "03/30/2022",
        "until": "03/30/2022"
    };

beforeAll(done=>{
    Post.remove({ 'headline' : headline }, (err)=>{});
    Post.remove({ 'headline' : headline + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Post.remove({ 'headline' : headline }, (err)=>{});
    Post.remove({ 'headline' : headline + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Post API',()=>{

    test('add new post, get post by id, get all posts',async ()=>{
        const response = await request(app).post('/api/posts')
        .send({
                "headline": headline,
                "userId": userId,
                "address": address,
                "pickUpDates": pickUpDates,
                "status": Status.COLLECTED
        });
        expect(response.statusCode).toEqual(200);
        const newPost = response.body.post;
        expect(newPost.headline).toEqual(headline);
        expect(newPost.userId).toEqual(userId);
        expect(newPost.address).toEqual(address);
        expect(Date.parse(newPost.pickUpDates[0].from)).toEqual(Date.parse(pickUpDates.from));
        expect(Date.parse(newPost.pickUpDates[0].until)).toEqual(Date.parse(pickUpDates.until));
        expect(newPost.status).toEqual(Status.COLLECTED);
        
        const response2 = await request(app).get('/api/posts/' + newPost._id);
        expect(response2.statusCode).toEqual(200);
        const post2 = response2.body.post;
        expect(post2._id).toEqual(newPost._id);
        expect(post2.headline).toEqual(headline);
        expect(post2.userId).toEqual(userId);
        expect(post2.address).toEqual(address);
        expect(Date.parse(post2.pickUpDates[0].from)).toEqual(Date.parse(pickUpDates.from));
        expect(Date.parse(post2.pickUpDates[0].until)).toEqual(Date.parse(pickUpDates.until));
        expect(post2.status).toEqual(Status.COLLECTED);

        const response3 = await request(app).get('/api/posts');
        const posts = response3.body.posts;
        expect(posts.length).toEqual(2);

        const response4 = await request(app).post('/api/posts/' + newPost._id)
        .send({
                "headline": headline + 'update',
                "userId": userId,
                "address": address + 'update',
                "pickUpDates": pickUpDates,
                "status": Status.PARTIALLY_COLLECTED
        });
        expect(response4.statusCode).toEqual(200);
        const response5 = await request(app).get('/api/posts/' + newPost._id);
        const updatedPost = response5.body.post;
        expect(updatedPost._id).toEqual(newPost._id);
        expect(updatedPost.headline).toEqual(headline + 'update');
        expect(updatedPost.userId).toEqual(userId);
        expect(updatedPost.address).toEqual(address + 'update');
        expect(Date.parse(updatedPost.pickUpDates[0].from)).toEqual(Date.parse(pickUpDates.from));
        expect(Date.parse(updatedPost.pickUpDates[0].until)).toEqual(Date.parse(pickUpDates.until));
        expect(updatedPost.status).toEqual(Status.PARTIALLY_COLLECTED);
    });

});