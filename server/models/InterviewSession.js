import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'ai', 'system'], // system for context setting
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobRole: {
        type: String, // e.g., 'Frontend Developer', 'Data Scientist'
        required: true
    },
    experienceLevel: {
        type: String, // 'Entry', 'Intermediate', 'Senior'
        default: 'Entry'
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    messages: [messageSchema],
    feedback: {
        score: { type: Number }, // 0-100
        strengths: [String],
        weaknesses: [String],
        summary: String,
        technicalAccuracy: String,
        communicationSkills: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('InterviewSession', interviewSessionSchema);
