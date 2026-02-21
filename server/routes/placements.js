import express from 'express';
import PlacementPost from '../models/PlacementPost.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/placements
// @desc    Get all placement posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { type, search, company } = req.query;
        let query = {};

        if (type && String(type) !== 'All') {
            query.type = String(type).toLowerCase();
        }

        if (company) {
            query.company = new RegExp(String(company), 'i');
        }

        if (search) {
            query.$text = { $search: search };
        }

        const posts = await PlacementPost.find(query)
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ posts });
    } catch (error) {
        console.error('Get placements error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/placements
// @desc    Create a placement post
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { type, company, title, content, role, package: pkg, location, deadline, applyLink, tags } = req.body;

        const post = new PlacementPost({
            type,
            company,
            title,
            content,
            role,
            package: pkg,
            location,
            deadline,
            applyLink,
            tags,
            author: req.user._id
        });

        await post.save();
        await post.populate('author', 'name');

        res.status(201).json({ post });
    } catch (error) {
        console.error('Create placement post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/placements/:id/like
// @desc    Like/unlike a post
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await PlacementPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ likes: post.likes.length });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/placements/stats
// @desc    Get placement statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const totalExperiences = await PlacementPost.countDocuments({ type: 'experience' });
        const totalAlerts = await PlacementPost.countDocuments({ type: 'alert' });
        const companies = await PlacementPost.distinct('company');

        res.json({
            totalExperiences,
            totalAlerts,
            totalCompanies: companies.length
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/placements/:id
// @desc    Delete a placement post
// @access  Private (owner or admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await PlacementPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
