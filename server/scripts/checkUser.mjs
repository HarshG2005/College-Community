
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'principal@bmsit.in' });
    if (user) {
        console.log('User found:', user.name);
        console.log('Role:', user.role);
    } else {
        console.log('User NOT found!');
    }
    await mongoose.disconnect();
}
checkUser().catch(console.error);
