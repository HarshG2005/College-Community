
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

console.log('🔍 Testing Gemini API Connection...');
console.log('API Key present:', process.env.GEMINI_API_KEY ? '✅ Yes' : '❌ No');
if (process.env.GEMINI_API_KEY) {
    console.log('API Key starting with:', process.env.GEMINI_API_KEY.substring(0, 5) + '...');
}

async function testGemini() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('API Key Missing');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

        console.log('🤖 Sending test prompt to Gemini...');
        const prompt = "Say 'Hello from Gemini!' if you can hear me.";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini Response:', text);
    } catch (error) {
        console.error('❌ Gemini Test Failed:', error);
        console.error('Error Details:', JSON.stringify(error, null, 2));
        if (error.message?.includes('API key not valid')) {
            console.error('💡 Tip: Double check the API key content.');
        }
    }
}

testGemini();
