
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('API Key Missing');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Method to list models might vary, checking standard way
        // There isn't a direct "listModels" on genAI client in some versions, 
        // but let's try to just infer or use a known working one.
        // Actually, for the JS SDK, listing models is not always straightforward without the right method.
        // Let's try to just test "gemini-1.5-flash" again with strict error logging.
        // Better: let's try "gemini-1.5-flash-latest" or "gemini-pro"

        console.log("Testing specific models...");

        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash-latest"
        ];

        for (const modelName of modelsToTest) {
            console.log(`\n👉 Testing model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working!`);
                return; // Exit on first success
            } catch (error) {
                console.log(`❌ FAILED: ${modelName} - ${error.message.split(' ')[0]} ${error.status || ''}`);
            }
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

listModels();
