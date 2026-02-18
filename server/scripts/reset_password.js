import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
    console.log('Usage: node scripts/reset_password.js <email> <new_password>');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        try {
            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                console.log(`❌ User not found with email: ${email}`);
                // Option to create if not exists?
                console.log('Creating new admin user...');
                const newUser = new User({
                    name: 'Admin User',
                    email: email.toLowerCase(),
                    password: newPassword,
                    role: 'admin'
                });
                await newUser.save();
                console.log(`✅ Created new admin user: ${email}`);
            } else {
                user.password = newPassword;
                // Pre-save hook will hash it
                await user.save();
                console.log(`✅ Successfully reset password for ${email}`);
            }
        } catch (err) {
            console.error('Error resetting password:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });
