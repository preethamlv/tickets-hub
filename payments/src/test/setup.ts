import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51KSebXCos1FxN7Xl7oY81urhKFJnIk34i0zzY5lB9BW15BodiAVTldjtr2KL2qEg19afqFy6ZPdlPv2K1AT3HDtJ000dFSJVDI';

let mongo: MongoMemoryServer;

beforeAll(async() => {
    process.env.JWT_KEY = 'asdfasdf';

    // mongo = new MongoMemoryServer();
    mongo = await MongoMemoryServer.create();

    const mongoUri = await mongo.getUri();
    
    /*
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    */
   
    await mongoose.connect(mongoUri);
});

beforeEach(async() => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({})
    }
});

afterAll(async() => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // Create the JWT 
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that has the cookie with the encoded data
    return [`session=${base64}`];
}
