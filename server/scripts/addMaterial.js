import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import StudyMaterial from '../models/StudyMaterial.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';

const addMaterial = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the admin user to attribute the upload to
        // If principal@bmsit.in doesn't exist, we'll try to find the first user available
        let user = await User.findOne({ email: 'principal@bmsit.in' });

        if (!user) {
            console.log('Admin user (principal@bmsit.in) not found. Trying to find any user...');
            user = await User.findOne({});
        }

        if (!user) {
            console.log('No users found in database. Please register a user first.');
            process.exit(1);
        }

        console.log(`Attributing upload to user: ${user.name} (${user.email})`);

        // Check if material already exists to avoid duplicates
        const existingMaterial = await StudyMaterial.findOne({ fileUrl: 'https://drive.google.com/drive/folders/11EPaFj5_lZoM_C26nWWu3sbQwUbgYcNK' });
        if (existingMaterial) {
            console.log('Material already exists in database.');
            process.exit(0);
        }

        const material = new StudyMaterial({
            title: 'BMSIT Complete Study Materials (Year 1-4)',
            description: 'Comprehensive collection of notes, question papers, and resources for all engineering years (1st to 4th year). Access the full Google Drive folder here.',
            subject: 'All',
            fileUrl: 'https://drive.google.com/drive/folders/11EPaFj5_lZoM_C26nWWu3sbQwUbgYcNK',
            fileType: 'OTHER',
            fileSize: 0,
            uploadedBy: user._id,
            tags: ['Notes', 'All Years', 'Engineering', 'BMSIT', 'Google Drive']
        });

        await material.save();
        console.log(`✅ Successfully added material: ${material.title}`);

    } catch (error) {
        console.error('Error adding material:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

addMaterial();
