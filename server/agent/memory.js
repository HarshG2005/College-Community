import mongoose from 'mongoose';

const AgentMemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentGoal: {
        type: String,
        default: ''
    },
    currentPlan: {
        type: Object, // Stores the active JSON plan
        default: null
    },
    interactionHistory: [{
        role: { type: String, enum: ['user', 'agent', 'critic', 'planner'] },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    meta: {
        lastActive: { type: Date, default: Date.now },
        studyHoursPerDay: Number,
        level: String
    }
}, { timestamps: true });

export default mongoose.model('AgentMemory', AgentMemorySchema);
