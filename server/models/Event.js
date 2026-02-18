import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 5000
    },
    category: {
        type: String,
        enum: ['hackathon', 'workshop', 'seminar', 'cultural', 'sports', 'academic', 'other'],
        default: 'other'
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true
    },
    organizer: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxParticipants: {
        type: Number,
        default: 100
    },
    registrationDeadline: {
        type: Date
    },
    imageUrl: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for participant count
eventSchema.virtual('participantCount').get(function () {
    return this.participants.length;
});

// Index for queries
eventSchema.index({ date: 1, category: 1 });

export default mongoose.model('Event', eventSchema);
