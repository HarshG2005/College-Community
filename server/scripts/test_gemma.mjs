
import dotenv from 'dotenv';
dotenv.config();

async function testGemma() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = "google/gemma-3-27b-it:free";

    console.log(`Testing OpenRouter with model: ${model}`);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": model,
                "messages": [
                    { "role": "user", "content": "Say hello!" }
                ]
            })
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testGemma();
