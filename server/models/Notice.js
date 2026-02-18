import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        maxlength: 5000
    },
    category: {
        type: String,
        enum: ['academic', 'event', 'placement', 'general'],
        default: 'general'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    isPinned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for search
noticeSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Notice', noticeSchema);
