import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        listUsers();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function listUsers() {
    try {
        const users = await User.find({}, 'name email role');
        console.log('--- Users ---');
        users.forEach(user => {
            console.log(`${user.email} (${user.name}) - Role: ${user.role}`);
        });
        console.log('-------------');
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        mongoose.disconnect();
    }
}
