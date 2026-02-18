import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'article', 'documentation', 'course'], default: 'article' }
});

const dayPlanSchema = new mongoose.Schema({
    dayNumber: Number, // 1 to 7
    topic: { type: String, required: true },
    description: String,
    resources: [resourceSchema],
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    timeSpent: Number // in minutes
});

const weekPlanSchema = new mongoose.Schema({
    weekNumber: Number,
    focus: String,
    days: [dayPlanSchema], // Array of 7 days
    isCompleted: { type: Boolean, default: false }
});

const studyPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String, // e.g., 'Data Structures'
        required: true
    },
    goal: {
        type: String, // e.g., 'Crack Placement Interview'
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    targetEndDate: Date,
    weeks: [weekPlanSchema], // The generated Schedule

    // Agentic Tracking Fields
    progress: {
        totalTopics: Number,
        completedTopics: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        lastActivity: Date
    },

    // The "Brain" Log - Tracks agent's autonomous decisions
    agentLog: [{
        action: String, // 'Reschedule', 'ContentUpdate', 'Motivation'
        details: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);
