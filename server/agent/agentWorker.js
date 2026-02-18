import cron from 'node-cron';
import * as Brain from './brain.js';
import User from '../models/User.js';

/**
 * Agent Worker: Handles periodic tasks and automations
 */

// 1. Daily Calendar Check (Run at 8:00 AM)
cron.schedule('0 8 * * *', async () => {
    console.log('🕒 [Agent Worker] Running daily calendar check...');
    try {
        // Find an admin to trigger the agent actions
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) return;

        const goal = "Check for upcoming events in the next 7 days and send reminder announcements if necessary.";

        console.log(`🤖 [Agent Worker] Triggering agent for admin: ${admin.email}`);

        // Init agent for the automated task
        await Brain.initializeAgent(admin._id, goal);

        // Plan
        console.log('🧠 [Agent Worker] Planning...');
        const plan = await Brain.plan(admin._id);

        // Auto-execute if the plan involves announcements or notices
        const shouldExecute = plan.some(step =>
            ['send_bulk_email', 'post_notice', 'get_upcoming_events'].includes(step.tool)
        );

        if (shouldExecute) {
            console.log('🚀 [Agent Worker] Executing automated plan...');
            await Brain.execute(admin._id);
        } else {
            console.log('😴 [Agent Worker] No relevant actions needed today.');
        }

    } catch (error) {
        console.error('❌ [Agent Worker] Error:', error);
    }
});

console.log('✅ Agent Worker initialized (Daily at 8 AM)');
