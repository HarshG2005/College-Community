import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        maxlength: 1000
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    fileType: {
        type: String,
        enum: ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'ZIP', 'OTHER'],
        default: 'PDF'
    },
    fileSize: {
        type: Number
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downloads: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Virtual for vote count
studyMaterialSchema.virtual('voteCount').get(function () {
    return this.upvotes.length - this.downvotes.length;
});

// Index for search
studyMaterialSchema.index({ title: 'text', description: 'text', subject: 'text' });

export default mongoose.model('StudyMaterial', studyMaterialSchema);
