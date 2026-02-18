
import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' }); // Correct path from root

const testOpenRouter = async () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("Testing OpenRouter with Key:", apiKey ? "Found key ending in " + apiKey.slice(-4) : "Missing");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    { "role": "user", "content": "Hello! Are you working?" }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Error: ${response.status} - ${err}`);
        }

        const data = await response.json();
        console.log("✅ OpenRouter Success:", data.choices[0].message.content);

    } catch (error) {
        console.error("❌ OpenRouter Failed:", error.message);
    }
};

testOpenRouter();
