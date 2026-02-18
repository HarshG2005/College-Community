import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';
const email = process.argv[2];

if (!email) {
    console.log('Please provide an email address: node scripts/makeAdmin.js <email>');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        makeAdmin();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function makeAdmin() {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found with email: ${email}`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Successfully promoted ${user.name} (${user.email}) to Admin!`);
    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        mongoose.disconnect();
    }
}
