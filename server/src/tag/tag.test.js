const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Tag = require('./tag.model');

const name = 'Test Tag';

beforeAll(done=>{
    Tag.remove({ 'name' : name }, (err)=>{});
    Tag.remove({ 'name' : name + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Tag.remove({ 'name' : name }, (err)=>{});
    Tag.remove({ 'name' : name + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Tag API',()=>{

    test('add new tag, get tag by id, get all tags',async ()=>{
        const response = await request(app).post('/api/tags')
        .send({ "name": name });
        expect(response.statusCode).toEqual(200);
        const newTag = response.body.tag;
        expect(newTag.name).toEqual(name);
        
        const response2 = await request(app).get('/api/tags/' + newTag._id);
        expect(response2.statusCode).toEqual(200);
        const tag2 = response2.body.tag;
        expect(tag2._id).toEqual(newTag._id);
        expect(tag2.name).toEqual(name);

        const response3 = await request(app).get('/api/tags');
        const tags = response3.body.tags;
        expect(tags.length).toBeGreaterThanOrEqual(1);

        const response4 = await request(app).post('/api/tags/' + newTag._id)
        .send({
                "name": name + 'update'
        });
        expect(response4.statusCode).toEqual(200);
        const response5 = await request(app).get('/api/tags/' + newTag._id);
        const updatedTag = response5.body.tag;
        expect(updatedTag._id).toEqual(newTag._id);
        expect(updatedTag.name).toEqual(name + 'update');
    });

});