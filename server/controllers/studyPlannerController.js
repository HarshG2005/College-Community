import { GoogleGenerativeAI } from '@google/generative-ai';
import StudyPlan from '../models/StudyPlan.js';
import { generateContentWithRetry } from '../utils/geminiClient.js'; // Assuming this exists or I'll use direct

// Initialize Gemini
// Initialize Gemini lazily inside functions to ensure process.env is loaded

export const generatePlan = async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

        const { subject, goal, level, daysPerWeek, hoursPerDay } = req.body;
        const userId = req.user._id;

        console.log(`🤖 Generative AI: Creating Study Plan for ${subject} (${level})`);

        const prompt = `
            Act as an Expert Private Tutor and Career Coach.
            Create a detailed, day-by-day study plan for a student.

            Subject: ${subject}
            Goal: ${goal}
            Current Level: ${level}
            Availability: ${daysPerWeek} days/week, ${hoursPerDay} hours/day.
            Duration: Plan for 2 weeks (14 days) initially.

            Output strictly in this JSON format:
            {
                "weeks": [
                    {
                        "weekNumber": 1,
                        "focus": "Week 1 theme",
                        "days": [
                            {
                                "dayNumber": 1,
                                "topic": "Brief Topic Name",
                                "description": "What to learn in ${hoursPerDay} hours",
                                "resources": [
                                    { "title": "Resource Title", "url": "https://example.com", "type": "article" }
                                ]
                            }
                            // ... 7 days
                        ]
                    }
                    // ... 2 weeks
                ]
            }
            Important:
            - Make the schedule VALID JSON.
            - Ensure 'dayNumber' is 1-7 for each week.
            - Provide REAL, high-quality resource links (documentation, reputable tutorials) if possible, or placeholder generic search links.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const planData = JSON.parse(cleanJson);

        // Calculate total stats
        let totalTopics = 0;
        planData.weeks.forEach(w => totalTopics += w.days.length);

        const newPlan = new StudyPlan({
            userId,
            subject,
            goal,
            weeks: planData.weeks,
            progress: { totalTopics, completedTopics: 0, percentage: 0 },
            agentLog: [{ action: 'Created', details: `Generated ${level} plan for ${subject}` }]
        });

        await newPlan.save();
        res.status(201).json(newPlan);

    } catch (error) {
        console.error('❌ Study Plan Generation Failed:', error);
        res.status(500).json({ message: 'Failed to generate study plan', error: error.message });
    }
};

export const getPlans = async (req, res) => {
    try {
        const plans = await StudyPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch plans' });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { planId, weekNumber, dayNumber, isCompleted } = req.body;

        const plan = await StudyPlan.findOne({ _id: planId, userId: req.user._id });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // Find the day and update
        const week = plan.weeks.find(w => w.weekNumber === weekNumber);
        const day = week?.days.find(d => d.dayNumber === dayNumber);

        if (day) {
            day.isCompleted = isCompleted;
            if (isCompleted) day.completedAt = new Date();

            // Recalculate progress
            let completedCount = 0;
            let totalCount = 0;
            plan.weeks.forEach(w => {
                w.days.forEach(d => {
                    totalCount++;
                    if (d.isCompleted) completedCount++;
                });
            });

            plan.progress.completedTopics = completedCount;
            plan.progress.totalTopics = totalCount;
            plan.progress.percentage = Math.round((completedCount / totalCount) * 100);
            plan.progress.lastActivity = new Date();

            await plan.save();
            res.json(plan);
        } else {
            res.status(404).json({ message: 'Day not found in plan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update progress' });
    }
};

// The Agentic "Brain" to check and reschedule
export const syncAgent = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = await StudyPlan.findOne({ _id: planId, userId: req.user._id });

        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // Check for missed days
        // Simple logic: If "yesterday" was a scheduled day but isConfirmed is false
        // For prototype, we'll just check if there are any "past" days that are incomplete
        const today = new Date(); // In real app, use user's timezone

        // Find first incomplete day
        let firstIncompleteDay = null;
        let missedTopics = [];

        plan.weeks.forEach(w => {
            w.days.forEach(d => {
                // Assuming day 1 was start date... simplifiction for prototype
                // We'll just look for ANY incomplete day that "should" have been done
                // For this demo, let's say if we have > 2 incomplete days, we reschedule
                if (!d.isCompleted && !firstIncompleteDay) {
                    firstIncompleteDay = d;
                }
                if (!d.isCompleted) missedTopics.push(d.topic);
            });
        });

        // Trigger Agent if user is "stuck" (e.g. has incomplete days but is asking for sync)
        // In a real agent, this runs on cron. Here we simulate "Agent wakes up".

        console.log(`🤖 Agent: Checking plan status for ${plan.subject}...`);

        if (missedTopics.length > 0) {
            console.log(`🤖 Agent: Detected ${missedTopics.length} pending topics. Re-optimizing...`);

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

            const prompt = `
                The student is behind on their ${plan.subject} plan.
                They have NOT completed: ${missedTopics.join(', ')}.
                
                Goal: ${plan.goal}
                Current Plan Duration: ${plan.weeks.length} weeks.

                Action: RESCHEDULE the remaining topics.
                - Prioritize key concepts.
                - Merge smaller topics if possible.
                - Extend the plan by a few days if absolutely necessary.
                
                Output strictly in JSON format (same structure as before, but only the REVISED weeks/days starting from Day 1 of the *remaining* work).
                {
                    "weeks": [ ... ]
                }
            `;

            // Call Gemini
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const revisedData = JSON.parse(cleanJson);

            // Update plan
            // In a real app, we'd carefully merge. Here we'll overwrite the future weeks
            // For the demo, let's just append the new structure or replace entirely?
            // Let's replace the whole schedule for simplicity of the prompt result
            plan.weeks = revisedData.weeks;

            plan.agentLog.push({
                action: 'Auto-Reschedule',
                details: `Agent detected ${missedTopics.length} pending topics. Re-optimized schedule to prioritize: ${missedTopics.slice(0, 3).join(', ')}...`,
                timestamp: new Date()
            });

            await plan.save();

            return res.json({
                message: 'Agent rescheduled your plan!',
                agentAction: 'Rescheduled',
                newPlan: plan
            });
        }

        res.json({ message: 'Plan is on track! Keep it up.' });

    } catch (error) {
        console.error('❌ Agent Sync Failed:', error);
        res.status(500).json({ message: 'Agent failed to sync', error: error.message });
    }
};
