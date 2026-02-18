
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import StudyPlan from '../models/StudyPlan.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkPlans() {
    console.log('🔍 Checking Study Plans in DB...');
    let logOutput = '';

    try {
        await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
        console.log('✅ Connected to MongoDB');

        const plans = await StudyPlan.find().sort({ createdAt: -1 }).limit(5);
        logOutput += `✅ Found ${plans.length} recent Study Plans.\n`;

        plans.forEach((p, i) => {
            logOutput += `[${i}] PlanID: ${p._id}, UserID: ${p.userId}, Subject: ${p.subject}, Created: ${p.createdAt}\n`;
        });

        fs.writeFileSync('debug_plans.txt', logOutput, 'utf8');
        console.log('Results written to debug_plans.txt');

    } catch (error) {
        console.log('❌ Check Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkPlans();
