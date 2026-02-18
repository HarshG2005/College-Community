
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    console.log('🔍 Listing Available Models...');
    console.log('🔑 API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'MISSING');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ API Key missing!');
        return;
    }

    try {
        // The GoogleGenerativeAI client doesn't expose listModels directly.
        // We need to use the generative language API via fetch or a different client method if available.
        // Actually, older versions or different packages expose it. 
        // Let's try to infer if we can just make a fetch call.

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Available Models:');
            const modelsList = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                .map(m => `- ${m.name} (${m.displayName})`)
                .join('\n');

            console.log(modelsList);
            const fs = await import('fs');
            fs.writeFileSync('models_list.txt', modelsList);
        } else {
            console.log('❌ No models found or error:', data);
        }

    } catch (error) {
        console.log('❌ List Models Failed:');
        console.error(error);
    }
}

listModels();
