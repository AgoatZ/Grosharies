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
    let newTag;

    test('add new tag', async ()=>{
        const response = await request(app).post('/api/tags')
        .send({ "name": name });
        expect(response.statusCode).toEqual(200);
        newTag = response.body.tag;
        expect(newTag.name).toEqual(name);
    });

    test('get tag by id', async () => {
        const response = await request(app).get('/api/tags/' + newTag._id);
        expect(response.statusCode).toEqual(200);
        const tag = response.body.tag;
        expect(tag._id).toEqual(newTag._id);
        expect(tag.name).toEqual(name);
    });

    test('get all tags', async () => {
        const response = await request(app).get('/api/tags');
        const tags = response.body.tags;
        expect(tags.length).toBeGreaterThanOrEqual(1);
    });

    test('update tag', async () => {
        const response = await request(app).put('/api/tags/' + newTag._id)
        .send({
                "name": name + 'update'
        });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/tags/' + newTag._id);
        const updatedTag = response2.body.tag;
        expect(updatedTag._id).toEqual(newTag._id);
        expect(updatedTag.name).toEqual(name + 'update');
    });
});