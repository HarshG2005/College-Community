
export const generateAgentPlan = async (goal, existingContext = {}) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const modelName = process.env.AL_MODEL || "models/gemma-3-27b-it";

        if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

        const prompt = `
            Act as an Expert Academic Planner.
            Goal: "${goal}"
            Context: ${JSON.stringify(existingContext).substring(0, 500)}
            
            Analyze the goal and generate a step-by-step Execution Plan using available tools.
            You have access to these tools:
            1. "create_study_schedule" (params: subject, days, hours_per_day) - For academic planning.
            2. "search_resources" (params: query) - To find study materials.
            3. "log_progress" (params: activity) - To track student progress.
            4. "send_bulk_email" (params: subject, content) - For sending announcements to all students.
            5. "brainstorm_project_ideas" (params: interests, skills) - To suggest 5 project ideas.
            6. "get_upcoming_events" (params: days) - To fetch events from the academic calendar.
            7. "post_notice" (params: title, content, category) - To create a new public notice.

            Output strictly in JSON format as a list of independent steps (no markdown, no explanation, just the JSON array):
            [
                { "tool": "brainstorm_project_ideas", "params": { "interests": "web development", "skills": "JavaScript" }, "reasoning": "User wants project ideas for web dev." }
            ]
        `;

        console.log(`🤖 Agent Planner: Using Gemini API with model ${modelName}...`);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3
                    }
                })
            }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${err}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Empty response from Gemini");

        // Robust JSON Extraction (Find Array [...])
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error("Agent Planner: No JSON Array in response:", text);
            throw new Error("No JSON Array found in response");
        }

        try {
            const plan = JSON.parse(jsonMatch[0]);
            console.log(`✅ Agent Planner: Generated ${plan.length} step(s)`);
            return plan;
        } catch (e) {
            console.error("Agent Planner: JSON Parse Error", e);
            console.error("Raw Text:", text);
            throw e;
        }

    } catch (error) {
        console.error('Agent Planner Error:', error.message);
        throw error;
    }
};
