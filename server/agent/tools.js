
import StudyPlan from '../models/StudyPlan.js';
import Event from '../models/Event.js';
import Notice from '../models/Notice.js';
import User from '../models/User.js';
import { sendAnnouncement } from '../utils/emailService.js';
import fs from 'fs';

// Tool 1: Create Study Schedule (Real Implementation)
const create_study_schedule = async (userId, params) => {
    try {
        console.log(`🤖 Agent Tool: Creating detailed schedule for ${params.subject}...`);

        const apiKey = process.env.OPENROUTER_API_KEY;
        // const modelName = process.env.AI_MODEL || "google/gemini-2.0-flash-001";
        const modelName = process.env.AI_MODEL || "google/gemini-2.0-flash-001"; // Fallback to working model

        if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing");

        const days = params.days || 7;
        const hours = params.hours_per_day || 2;

        const prompt = `
            Act as an Efficient Private Tutor.
            Create a CONCISE, day-by-day study plan.

            Subject: ${params.subject}
            Goal: Master ${params.subject} basics.
            Duration: ${days} days.
            Intensity: ${hours} hours/day.

            Output strictly in this JSON format:
            {
                "weeks": [
                    {
                        "weekNumber": 1,
                        "focus": "Fundamentals",
                        "days": [
                            {
                                "dayNumber": 1,
                                "topic": "Brief Topic",
                                "description": "Short summary of what to learn.",
                                "resources": [
                                    { "title": "Guide", "url": "https://google.com/search?q=${params.subject}+guide", "type": "article" }
                                ]
                            }
                        ]
                    }
                ]
            }
            Ensure generated plan covers ${days} days. Keep descriptions short.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                // "HTTP-Referer": "http://localhost:5000",
            },
            body: JSON.stringify({
                "model": modelName, // Free model often reliable
                "messages": [
                    { "role": "system", "content": "You are a helpful Tutor. Output strictly in JSON." },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${err}`);
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        // Robust JSON Extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        const cleanJson = jsonMatch[0];

        let planData;
        try {
            planData = JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON Parse Error. Raw Text:", text);
            throw new Error("Failed to parse plan JSON");
        }

        let totalTopics = 0;
        if (planData.weeks) {
            planData.weeks.forEach(w => totalTopics += w.days.length);
        }

        const newPlan = new StudyPlan({
            userId,
            subject: params.subject,
            goal: `Agent Generated: Learn ${params.subject}`,
            weeks: planData.weeks || [],
            progress: { totalTopics, completedTopics: 0, percentage: 0 },
            agentLog: [{ action: 'Created', details: `Agent created ${days}-day plan for ${params.subject}` }]
        });

        await newPlan.save();
        console.log('✅ Agent: Plan saved to DB:', newPlan._id);

        // DEBUG: Write to log file
        try {
            const logMsg = `[${new Date().toISOString()}] Saved Plan | User: ${userId} | Subject: ${params.subject} | ID: ${newPlan._id}\n`;
            fs.appendFileSync('server/debug_tools_log.txt', logMsg);
        } catch (logErr) { console.error("Log file error", logErr); }

        return {
            status: "success",
            message: `Created and saved a ${days}-day study schedule for ${params.subject}. Check your Dashboard!`,
            data: {
                planId: newPlan._id,
                subject: params.subject,
                duration: `${days} days`
            }
        };

    } catch (error) {
        console.error('❌ Agent Tool Failed:', error);
        // DEBUG: Log failure
        try {
            const failMsg = `[${new Date().toISOString()}] Plan FAILED | User: ${userId} | Subject: ${params.subject} | Error: ${error.message}\n`;
            fs.appendFileSync('server/debug_tools_log.txt', failMsg);
        } catch (l) { }

        return { status: "error", message: `Failed to generate detailed plan: ${error.message}` };
    }
};

// Tool 2: Search Resources (Simulated)
const search_resources = async (userId, params) => {
    return {
        status: "success",
        message: `Found 5 resources for ${params.query}`,
        data: [
            { title: `${params.query} Official Docs`, url: "https://docs.example.com" },
            { title: `Learn ${params.query} in 10 mins`, url: "https://youtube.com/example" }
        ]
    };
};

// Tool 3: Log Progress (Simulated)
const log_progress = async (userId, params) => {
    return {
        status: "success",
        message: `Logged: ${params.activity}`,
        data: { timestamp: new Date() }
    };
};

// Tool 4: Send Bulk Email
const send_bulk_email = async (userId, params) => {
    try {
        console.log(`🤖 Agent Tool: Sending bulk email for ${params.subject}...`);

        // Fetch all student emails
        const students = await User.find({ role: 'student' }).select('email');
        const recipientList = students.map(s => s.email);

        if (recipientList.length === 0) {
            return { status: "error", message: "No students found to send emails to." };
        }

        const result = await sendAnnouncement(recipientList, params.subject, params.content);

        if (result.success) {
            let message = result.fallback
                ? `📋 Email not configured — announcement posted as a Notice on the platform for ${recipientList.length} students.`
                : `✅ Announcement email sent to ${recipientList.length} students.`;

            // If email failed/fallback, also post as a notice so students still see it
            if (result.fallback) {
                const newNotice = new Notice({
                    title: params.subject,
                    content: params.content,
                    category: 'general',
                    author: userId
                });
                await newNotice.save();
                message += ' A notice has also been posted on the platform.';
            }

            return {
                status: "success",
                message,
                data: { messageId: result.messageId, fallback: result.fallback }
            };
        } else {
            return { status: "error", message: result.error || "Failed to send email." };
        }
    } catch (error) {
        return { status: "error", message: error.message };
    }
};

// Tool 5: Brainstorm Project Ideas (using Gemini with Gemma 3)
const brainstorm_project_ideas = async (userId, params) => {
    try {
        console.log(`🤖 Agent Tool: Brainstorming project ideas for ${params.interests}...`);
        const apiKey = process.env.GEMINI_API_KEY;
        const modelName = process.env.AL_MODEL || "models/gemma-3-27b-it";

        if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

        const prompt = `Act as a Senior Project Mentor.
Suggest 5 innovative and feasible project ideas for a student interested in: ${params.interests}.
Their current skills are: ${params.skills || 'General Engineering'}.

Provide the output in this JSON format:
{
    "ideas": [
        {
            "title": "Project Title",
            "description": "Clear explanation of the problem and solution.",
            "technologies": ["Tech 1", "Tech 2"],
            "difficulty": "Easy/Medium/Hard"
        }
    ]
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7 }
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

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");
        const ideasData = JSON.parse(jsonMatch[0]);

        return {
            status: "success",
            message: `Generated ${ideasData.ideas.length} project ideas.`,
            data: ideasData.ideas
        };
    } catch (error) {
        return { status: "error", message: error.message };
    }
};

// Tool 6: Get Upcoming Events
const get_upcoming_events = async (userId, params) => {
    try {
        const days = params.days || 7;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + days);

        console.log(`🤖 Agent Tool: Fetching events from ${startDate.toDateString()} to ${endDate.toDateString()}...`);

        const events = await Event.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        return {
            status: "success",
            message: `Found ${events.length} events in the next ${days} days.`,
            data: events
        };
    } catch (error) {
        return { status: "error", message: error.message };
    }
};

// Tool 7: Post Notice
const post_notice = async (userId, params) => {
    try {
        console.log(`🤖 Agent Tool: Posting notice "${params.title}"...`);
        const newNotice = new Notice({
            title: params.title,
            content: params.content,
            category: params.category || 'general',
            author: userId
        });
        await newNotice.save();
        return {
            status: "success",
            message: `Notice posted successfully!`,
            data: { noticeId: newNotice._id }
        };
    } catch (error) {
        return { status: "error", message: error.message };
    }
};

// Helper to execute a tool by name
export const executeTool = async (userId, toolName, params) => {
    const tool = tools[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);
    return await tool(userId, params);
};

export const tools = {
    create_study_schedule,
    search_resources,
    log_progress,
    send_bulk_email,
    brainstorm_project_ideas,
    get_upcoming_events,
    post_notice
};
