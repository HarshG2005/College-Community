import express from 'express';
import Notice from '../models/Notice.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notices
// @desc    Get all notices
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category.toLowerCase();
        }

        if (search) {
            query.$text = { $search: search };
        }

        const notices = await Notice.find(query)
            .populate('author', 'name')
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(50);

        res.json({ notices });
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/notices
// @desc    Create a notice
// @access  Admin only
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { title, content, category, isPinned } = req.body;

        const notice = new Notice({
            title,
            content,
            category,
            isPinned,
            author: req.user._id
        });

        await notice.save();
        await notice.populate('author', 'name');

        res.status(201).json({ notice });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/notices/:id/like
// @desc    Like/unlike a notice
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        const likeIndex = notice.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            notice.likes.splice(likeIndex, 1);
        } else {
            notice.likes.push(req.user._id);
        }

        await notice.save();
        res.json({ likes: notice.likes.length });
    } catch (error) {
        console.error('Like notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/notices/:id/comments
// @desc    Add a comment
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        notice.comments.push({
            user: req.user._id,
            text: req.body.text
        });

        await notice.save();
        await notice.populate('comments.user', 'name');

        res.json({ comments: notice.comments });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/notices/:id
// @desc    Delete a notice
// @access  Admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted' });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
