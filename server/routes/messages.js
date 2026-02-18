import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/:room
// @desc    Get messages for a room
// @access  Private
router.get('/:room', auth, async (req, res) => {
    try {
        const { room } = req.params;
        const { limit = 50, before } = req.query;

        let query = { room };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .populate('sender', 'name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { content, room, type, fileUrl } = req.body;

        const message = new Message({
            sender: req.user._id,
            content,
            room,
            type: type || 'text',
            fileUrl
        });

        await message.save();
        await message.populate('sender', 'name');

        res.status(201).json({ message });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/messages/rooms/list
// @desc    Get list of available rooms
// @access  Private
router.get('/rooms/list', auth, async (req, res) => {
    try {
        const rooms = await Message.aggregate([
            {
                $group: {
                    _id: '$room',
                    lastMessage: { $last: '$content' },
                    lastMessageTime: { $last: '$createdAt' },
                    messageCount: { $sum: 1 }
                }
            },
            { $sort: { lastMessageTime: -1 } },
            { $limit: 20 }
        ]);

        res.json({ rooms });
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
