const app = require('.././../index');
const request = require('supertest');
const mongoosse = require('../db');
const { response } = require('.././../index');
const Grocery = require('./grocery.model');
const Packing = require('../enums/packing');
const Scale = require('../enums/scale');

const name = 'Test Grocery';
const amount = 6;
const scale = Scale.KILOGRAM;
const packing = Packing.GLASS_BOTTLE;
const categoryId = "62460f8073423b5b9468c00f";

beforeAll(done=>{
    Grocery.remove({ 'name' : name }, (err)=>{});
    Grocery.remove({ 'name' : name + 'update' }, (err)=>{
        done();
    });
});

afterAll(done=>{
    Grocery.remove({ 'name' : name }, (err)=>{});
    Grocery.remove({ 'name' : name + 'update' }, (err)=>{
        mongoosse.connection.close();
        done();
    });
});


describe('Testing Grocery API',()=>{
    let newGrocery;

    test('add new grocery, get grocery by id, get all groceries',async ()=>{
        const response = await request(app).post('/api/groceries')
        .send({
            "name": name,
            "amount": amount,
            "scale": scale,
            "packing": packing,
            "category": categoryId
        });
        expect(response.statusCode).toEqual(200);
        newGrocery = response.body.grocery;
        expect(newGrocery.name).toEqual(name);
    });

    test('get grocery by id test', async () => {
        const response = await request(app).get('/api/groceries/' + newGrocery._id);
        expect(response.statusCode).toEqual(200);
        const grocery = response.body.grocery;
        expect(grocery._id).toEqual(newGrocery._id);
        expect(grocery.name).toEqual(name);
        expect(grocery.amount).toEqual(amount);
        expect(grocery.scale).toEqual(Scale.KILOGRAM);
        expect(grocery.packing).toEqual(Packing.GLASS_BOTTLE);
    });

    test('get all groceries', async () => {
        const response = await request(app).get('/api/groceries');
        const groceries = response.body.groceries;
        expect(groceries.length).toBeGreaterThanOrEqual(1);
    });

    test('update grocery test', async () => {
        const response = await request(app).put('/api/groceries/' + newGrocery._id)
        .send({
            "name": name + 'update',
            "amount": amount + 10,
            "scale": Scale.LITRE,
            "packing": Packing.PLASTIC_BAG,
            "category": categoryId
        });
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app).get('/api/groceries/' + newGrocery._id);
        const updatedGrocery = response2.body.grocery;
        expect(updatedGrocery._id).toEqual(newGrocery._id);
        expect(updatedGrocery.name).toEqual(name + 'update');
        expect(updatedGrocery.amount).toEqual(amount + 10);
        expect(updatedGrocery.scale).toEqual(Scale.LITRE);
        expect(updatedGrocery.packing).toEqual(Packing.PLASTIC_BAG);
    });
});