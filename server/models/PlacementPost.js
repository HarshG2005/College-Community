import mongoose from 'mongoose';

const placementPostSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['experience', 'resource', 'alert'],
        required: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        maxlength: 10000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        trim: true
    },
    package: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    deadline: {
        type: Date
    },
    applyLink: {
        type: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for search
placementPostSchema.index({ title: 'text', content: 'text', company: 'text' });

export default mongoose.model('PlacementPost', placementPostSchema);
