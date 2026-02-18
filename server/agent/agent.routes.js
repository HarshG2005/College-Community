import express from 'express';
import { auth } from '../middleware/auth.js';
import * as Brain from './brain.js';

const router = express.Router();

// 1. Initialize Agent with a Goal
router.post('/init', auth, async (req, res) => {
    try {
        const { goal } = req.body;
        const result = await Brain.initializeAgent(req.user._id, goal);
        res.json({ message: 'Agent initialized', memory: result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to init agent', error: error.message });
    }
});

// 2. Ask Agent to Plan (Think)
router.post('/plan', auth, async (req, res) => {
    try {
        const plan = await Brain.plan(req.user._id);
        res.json({ message: 'Plan generated. Waiting for approval.', plan });
    } catch (error) {
        res.status(500).json({ message: 'Planning failed', error: error.message });
    }
});

// 3. Approve & Execute Plan (Act)
router.post('/execute', auth, async (req, res) => {
    try {
        const results = await Brain.execute(req.user._id);
        res.json({ message: 'Plan executed', results });
    } catch (error) {
        res.status(500).json({ message: 'Execution failed', error: error.message });
    }
});

// 4. Get Agent History
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Brain.getHistory(req.user._id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history', error: error.message });
    }
});

export default router;
