
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI;

async function checkUser() {
    try {
        await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
        // The ID from debug_plans.txt
        const targetId = '6987d9503a29b8a327e11d84';

        const user = await User.findById(targetId);
        if (user) {
            console.log(`✅ User Found: ${user.name} (${user.email})`);
            console.log('ID in DB:', user._id);
            console.log('ID String:', user._id.toString());
        } else {
            console.log('❌ User NOT found with ID:', targetId);
        }

    } catch (e) { console.log(e); }
    finally { mongoose.disconnect(); }
}
checkUser();
