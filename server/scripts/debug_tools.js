
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { tools } from '../agent/tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Dummy userId (needs to be valid ObjectId if saving to DB)
// I'll skip DB connection for now or mock the save?
// But tools.js tries to save to StudyPlan.
// So I MUST connect to DB.

const MONGODB_URI = process.env.MONGODB_URI;

async function testTools() {
    console.log('🔍 Testing Tool: create_study_schedule...');

    try {
        await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
        console.log('✅ Connected to MongoDB');

        // Find a random user or creating a dummy ID
        // Let's use a hardcoded valid ID or just a random one
        const userId = new mongoose.Types.ObjectId();

        const params = {
            subject: "Machine Learning",
            days: 3, // Keep it short for testing
            hours_per_day: 2
        };

        const result = await tools.create_study_schedule(userId, params);
        console.log('✅ Tool Result:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.log('❌ Tool Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testTools();
