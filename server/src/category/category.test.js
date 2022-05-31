const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Category = require('./category.model');

const name = 'Test Category';

beforeAll(done=>{
    Category.remove({ 'name' : name }, (err)=>{});
    Category.remove({ 'name' : name + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Category.remove({ 'name' : name }, (err)=>{});
    Category.remove({ 'name' : name + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Category API',()=>{
    let newCategory;

    test('add new category', async ()=>{
        const response = await request(app).post('/api/categories')
        .send({ "name": name });
        expect(response.statusCode).toEqual(200);
        newCategory = response.body.category;
        expect(newCategory.name).toEqual(name);
    });

    test('get category by id', async () => {
        const response = await request(app).get('/api/categories/' + newCategory._id);
        expect(response.statusCode).toEqual(200);
        const category = response.body.category;
        expect(category._id).toEqual(newCategory._id);
        expect(category.name).toEqual(name);
    });

    test('get all categories', async () => {
        const response = await request(app).get('/api/categories');
        const categories = response.body.categories;
        expect(categories.length).toBeGreaterThanOrEqual(1);
    });

    test('update category', async () => {
        const response = await request(app).put('/api/categories/' + newCategory._id)
        .send({
                "name": name + 'update'
        });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/categories/' + newCategory._id);
        const updatedCategory = response2.body.category;
        expect(updatedCategory._id).toEqual(newCategory._id);
        expect(updatedCategory.name).toEqual(name + 'update');
    });

});