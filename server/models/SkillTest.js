import mongoose from 'mongoose';

const skillTestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testType: {
        type: String,
        enum: ['dsa', 'communication', 'aptitude'],
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // in seconds
        required: true
    },
    answers: [{
        questionId: Number,
        selectedOption: Number,
        isCorrect: Boolean
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for quick lookups
skillTestSchema.index({ userId: 1, testType: 1 });

// Get latest test score for a user
skillTestSchema.statics.getLatestScore = async function (userId, testType) {
    const result = await this.findOne({ userId, testType })
        .sort({ completedAt: -1 })
        .select('score completedAt');
    return result;
};

export default mongoose.model('SkillTest', skillTestSchema);
