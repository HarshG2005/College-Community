import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';
// Use the admin credentials we know exist
const email = 'admin@college.edu';
const password = 'admin123';

console.log('🔍 Testing Login Flow...');
console.log('Environment Check:');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Present' : '❌ MISSING');
console.log('- MONGODB_URI:', MONGODB_URI ? '✅ Present' : '❌ MISSING');

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // 1. Find User
        console.log(`\n1. Searching for user: ${email}`);
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            console.error('❌ User not found!');
            process.exit(1);
        }
        console.log('✅ User found:', user._id);

        // 2. Compare Password
        console.log('\n2. Comparing password...');
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.error('❌ Password mismatch!');
            process.exit(1);
        }
        console.log('✅ Password matches.');

        // 3. Sign JWT
        console.log('\n3. Signing JWT...');
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing!');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log('✅ JWT Signed successfully.');
        console.log('Token:', token.substring(0, 20) + '...');

    } catch (error) {
        console.error('❌ CRITICAL FAILURE:', error);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
    }
};

run();
