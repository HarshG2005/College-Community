
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function listUsers() {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'name email role').sort({ createdAt: -1 }).limit(10);
    console.log('Recent Users:');
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
}
listUsers().catch(console.error);
