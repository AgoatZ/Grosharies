const app = require('F:/שולחן העבודה/עמית/Studies/Grosharies/Grosharies/server/index.js');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('F:/שולחן העבודה/עמית/Studies/Grosharies/Grosharies/server/index.js');
const Post = require('./post.model');

const headline = 'Test Post';
const userId = '62449a58c487bf4f38fbca59';
const address = 'NowhereTest 666';
const pickUpDates = {
        "from": "03/30/2022",
        "until": "03/30/2022"
    };
const status = 'collected';


beforeAll(done=>{
    Post.remove({ 'headline' : headline }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Post.remove({ 'headline' : headline }, (err)=>{
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
                "status": status
        });
        expect(response.statusCode).toEqual(200);
        const newPost = response.body.post;
        expect(newPost.address).toEqual(address);
        
        const response2 = await request(app).get('/api/posts/' + newPost._id);
        expect(response2.statusCode).toEqual(200);
        const post2 = response2.body.post;
        expect(post2.address).toEqual(address);

        res = await request(app).get('/api/posts');
        const posts = res.body.posts;
        expect(posts.length).toEqual(2);
    });

});