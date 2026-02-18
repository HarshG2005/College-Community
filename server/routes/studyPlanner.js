import express from 'express';
import { generatePlan, getPlans, updateProgress, syncAgent } from '../controllers/studyPlannerController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/study-planner/generate
// @desc    Generate a new AI study plan
// @access  Private
router.post('/generate', auth, generatePlan);

// @route   GET /api/study-planner/my-plans
// @desc    Get user's active plans
// @access  Private
router.get('/my-plans', auth, getPlans);

// @route   PUT /api/study-planner/progress
// @desc    Update progress for a specific day
// @access  Private
router.put('/progress', auth, updateProgress);

// @route   POST /api/study-planner/sync-agent
// @desc    Trigger the Agent to check and reschedule
// @access  Private
router.post('/sync-agent', auth, syncAgent);

export default router;
