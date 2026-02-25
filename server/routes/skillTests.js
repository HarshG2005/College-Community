import express from 'express';
import SkillTest from '../models/SkillTest.js';
import { auth } from '../middleware/auth.js';
import { calculateScore } from '../utils/scoreCalculator.js';

const router = express.Router();

// @route   POST /api/skill-tests
// @desc    Submit a skill test result
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { testType, timeTaken, answers } = req.body;

        const { score, correctAnswers, totalQuestions } = calculateScore(testType, answers);

        const skillTest = new SkillTest({
            userId: req.user._id,
            testType,
            score,
            totalQuestions,
            correctAnswers,
            timeTaken,
            answers
        });

        await skillTest.save();

        res.status(201).json({
            success: true,
            message: 'Test result saved successfully',
            data: skillTest
        });
    } catch (error) {
        console.error('Error saving skill test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save test result',
            error: error.message
        });
    }
});

// @route   GET /api/skill-tests/my-scores
// @desc    Get current user's test scores
// @access  Private
router.get('/my-scores', auth, async (req, res) => {
    try {
        const dsaScore = await SkillTest.getLatestScore(req.user._id, 'dsa');
        const communicationScore = await SkillTest.getLatestScore(req.user._id, 'communication');

        res.json({
            success: true,
            scores: {
                dsa: dsaScore ? {
                    score: dsaScore.score,
                    completedAt: dsaScore.completedAt
                } : null,
                communication: communicationScore ? {
                    score: communicationScore.score,
                    completedAt: communicationScore.completedAt
                } : null
            }
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scores',
            error: error.message
        });
    }
});

// @route   GET /api/skill-tests/history
// @desc    Get user's test history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const history = await SkillTest.find({ userId: req.user._id })
            .sort({ completedAt: -1 })
            .limit(20)
            .select('testType score totalQuestions correctAnswers timeTaken completedAt');

        res.json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history',
            error: error.message
        });
    }
});

// @route   GET /api/skill-tests/leaderboard/:testType
// @desc    Get leaderboard for a test type
// @access  Public
router.get('/leaderboard/:testType', async (req, res) => {
    try {
        const { testType } = req.params;

        // Get best score per user
        const leaderboard = await SkillTest.aggregate([
            { $match: { testType } },
            { $sort: { score: -1, timeTaken: 1 } },
            {
                $group: {
                    _id: '$userId',
                    bestScore: { $first: '$score' },
                    bestTime: { $first: '$timeTaken' },
                    completedAt: { $first: '$completedAt' }
                }
            },
            { $sort: { bestScore: -1, bestTime: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    name: '$user.name',
                    branch: '$user.branch',
                    score: '$bestScore',
                    timeTaken: '$bestTime'
                }
            }
        ]);

        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
});

export default router;
