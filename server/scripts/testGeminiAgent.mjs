import dotenv from 'dotenv';
dotenv.config();

async function testGeminiAgent() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Gemini API Key present:', !!apiKey);

    const prompt = `Act as an Expert Academic Planner.
Goal: "Suggest 3 project ideas for web development"

Generate a step-by-step Execution Plan using available tools.
Available tools: brainstorm_project_ideas (params: interests, skills)

Output strictly in JSON format as a list:
[
    { "tool": "brainstorm_project_ideas", "params": { "interests": "web development", "skills": "JavaScript" }, "reasoning": "User wants project ideas." }
]`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
            })
        }
    );

    console.log('Gemini response status:', response.status);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Plan generated:', text?.substring(0, 300));

    if (text) {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const plan = JSON.parse(jsonMatch[0]);
            console.log('✅ Plan parsed successfully! Steps:', plan.length);
            console.log('First step tool:', plan[0]?.tool);
        }
    }
}

testGeminiAgent().catch(e => console.error('ERROR:', e.message));
