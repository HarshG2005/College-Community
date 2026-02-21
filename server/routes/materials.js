import express from 'express';
import StudyMaterial from '../models/StudyMaterial.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/materials
// @desc    Get all study materials
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { subject, search, sort } = req.query;
        let query = {};

        // Security: Cast subject to string to prevent NoSQL injection via object payloads
        if (subject && String(subject) !== 'All') {
            query.subject = String(subject);
        }

        if (search) {
            query.$text = { $search: search };
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'popular') {
            sortOption = { downloads: -1 };
        }

        const materials = await StudyMaterial.find(query)
            .populate('uploadedBy', 'name')
            .sort(sortOption)
            .limit(50);

        res.json({ materials });
    } catch (error) {
        console.error('Get materials error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/materials
// @desc    Upload a study material
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, subject, fileUrl, fileType, fileSize, tags } = req.body;

        const material = new StudyMaterial({
            title,
            description,
            subject,
            fileUrl,
            fileType,
            fileSize,
            tags,
            uploadedBy: req.user._id
        });

        await material.save();
        await material.populate('uploadedBy', 'name');

        res.status(201).json({ material });
    } catch (error) {
        console.error('Upload material error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/materials/:id/vote
// @desc    Upvote or downvote material
// @access  Private
router.put('/:id/vote', auth, async (req, res) => {
    try {
        const { voteType } = req.body; // 'up' or 'down'
        const material = await StudyMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Remove existing vote
        material.upvotes = material.upvotes.filter(id => !id.equals(req.user._id));
        material.downvotes = material.downvotes.filter(id => !id.equals(req.user._id));

        // Add new vote
        if (voteType === 'up') {
            material.upvotes.push(req.user._id);
        } else if (voteType === 'down') {
            material.downvotes.push(req.user._id);
        }

        await material.save();
        res.json({
            upvotes: material.upvotes.length,
            downvotes: material.downvotes.length
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/materials/:id/download
// @desc    Increment download count
// @access  Private
router.put('/:id/download', auth, async (req, res) => {
    try {
        const material = await StudyMaterial.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
            { new: true }
        );

        res.json({ downloads: material.downloads });
    } catch (error) {
        console.error('Download count error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/materials/:id
// @desc    Delete a material
// @access  Private (owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const material = await StudyMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        if (!material.uploadedBy.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await material.deleteOne();
        res.json({ message: 'Material deleted' });
    } catch (error) {
        console.error('Delete material error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
