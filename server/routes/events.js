import express from 'express';
import Event from '../models/Event.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { category, upcoming } = req.query;
        let query = { isActive: true };

        if (category && String(category) !== 'All') {
            query.category = String(category).toLowerCase();
        }

        if (String(upcoming) === 'true') {
            query.date = { $gte: new Date() };
        }

        const events = await Event.find(query)
            .populate('createdBy', 'name')
            .sort({ date: 1 })
            .limit(50);

        res.json({ events });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events
// @desc    Create an event
// @access  Admin only
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { title, description, category, date, time, venue, organizer, maxParticipants, registrationDeadline, imageUrl } = req.body;

        const event = new Event({
            title,
            description,
            category,
            date,
            time,
            venue,
            organizer,
            maxParticipants,
            registrationDeadline,
            imageUrl,
            createdBy: req.user._id
        });

        await event.save();
        await event.populate('createdBy', 'name');

        res.status(201).json({ event });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/events/:id/register
// @desc    Register/unregister for an event
// @access  Private
router.put('/:id/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const participantIndex = event.participants.indexOf(req.user._id);
        let isRegistered;

        if (participantIndex > -1) {
            event.participants.splice(participantIndex, 1);
            isRegistered = false;
        } else {
            if (event.participants.length >= event.maxParticipants) {
                return res.status(400).json({ message: 'Event is full' });
            }
            event.participants.push(req.user._id);
            isRegistered = true;
        }

        await event.save();
        res.json({
            isRegistered,
            participants: event.participants.length
        });
    } catch (error) {
        console.error('Register event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/my-events
// @desc    Get user's registered events
// @access  Private
router.get('/my-events', auth, async (req, res) => {
    try {
        const events = await Event.find({
            participants: req.user._id,
            isActive: true
        }).populate('createdBy', 'name').sort({ date: 1 });

        res.json({ events });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
