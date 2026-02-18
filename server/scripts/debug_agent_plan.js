
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAgentPlan } from '../agent/planner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testPlanner() {
    console.log('🔍 Testing Agent Planner...');
    console.log('🔑 API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'MISSING');

    const goal = "Learn Python for Data Science in 1 week";
    console.log(`🎯 Goal: "${goal}"`);

    try {
        const result = await generateAgentPlan(goal);
        console.log('✅ Plan Generated Successfully:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log('❌ Planner Failed (Detailed):');
        console.log(error);
        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);
        }
    }
}

testPlanner();
