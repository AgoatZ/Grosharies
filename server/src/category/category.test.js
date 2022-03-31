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

    test('add new category, get category by id, get all categories',async ()=>{
        const response = await request(app).post('/api/categories')
        .send({ "name": name });
        expect(response.statusCode).toEqual(200);
        const newCategory = response.body.category;
        expect(newCategory.name).toEqual(name);
        
        const response2 = await request(app).get('/api/categories/' + newCategory._id);
        expect(response2.statusCode).toEqual(200);
        const category2 = response2.body.category;
        expect(category2._id).toEqual(newCategory._id);
        expect(category2.name).toEqual(name);

        const response3 = await request(app).get('/api/categories');
        const categories = response3.body.categories;
        expect(categories.length).toEqual(2);

        const response4 = await request(app).post('/api/categories/' + newCategory._id)
        .send({
                "name": name + 'update'
        });
        expect(response4.statusCode).toEqual(200);
        const response5 = await request(app).get('/api/categories/' + newCategory._id);
        const updatedCategory = response5.body.category;
        expect(updatedCategory._id).toEqual(newCategory._id);
        expect(updatedCategory.name).toEqual(name + 'update');
    });

});