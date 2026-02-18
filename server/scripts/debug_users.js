import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        try {
            const users = await User.find({}).select('+password');
            console.log(`\nFound ${users.length} users:`);
            console.log('---------------------------------------------------');
            users.forEach(u => {
                console.log(`Email: ${u.email}`);
                console.log(`Name:  ${u.name}`);
                console.log(`Role:  ${u.role}`);
                console.log(`Hash:  ${u.password ? u.password.substring(0, 15) + '...' : 'MISSING'}`);
                console.log('---------------------------------------------------');
            });
        } catch (err) {
            console.error('Error querying users:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });
