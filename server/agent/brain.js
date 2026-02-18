import AgentMemory from './memory.js';
import { generateAgentPlan } from './planner.js';
import { executeTool } from './tools.js';

// 1. Initialize or Reset Agent for a User
export const initializeAgent = async (userId, goal) => {
    // Clear previous memory or archive it (simple version: overwrite)
    let memory = await AgentMemory.findOne({ userId });

    if (!memory) {
        memory = new AgentMemory({ userId });
    }

    memory.currentGoal = goal;
    memory.currentPlan = null;
    memory.interactionHistory.push({ role: 'user', content: `Start goal: ${goal}` });
    await memory.save();
    return memory;
};

// 2. Generate a Plan (Think)
export const plan = async (userId) => {
    const memory = await AgentMemory.findOne({ userId });
    if (!memory) throw new Error('Agent not initialized');

    // Call LLM Planner
    const planStructure = await generateAgentPlan(memory.currentGoal, memory.interactionHistory);

    memory.currentPlan = planStructure;
    memory.interactionHistory.push({ role: 'planner', content: JSON.stringify(planStructure) });
    await memory.save();

    return planStructure;
};

// 3. Execute the Approved Plan (Act)
export const execute = async (userId) => {
    const memory = await AgentMemory.findOne({ userId });
    if (!memory || !memory.currentPlan) throw new Error('No approved plan to execute');

    const executionResults = [];

    // memory.currentPlan is an Array of steps
    for (const step of memory.currentPlan) {
        try {
            const result = await executeTool(userId, step.tool, step.params);
            executionResults.push({ step, status: 'success', result });

            memory.interactionHistory.push({
                role: 'agent',
                content: `Executed ${step.tool}: ${JSON.stringify(result)}`
            });

        } catch (error) {
            executionResults.push({ step, status: 'failed', error: error.message });
            memory.interactionHistory.push({
                role: 'agent',
                content: `Failed ${step.tool}: ${error.message}`
            });
        }
    }

    await memory.save();
    return executionResults;
};

// 4. Get History
export const getHistory = async (userId) => {
    return await AgentMemory.findOne({ userId });
};
