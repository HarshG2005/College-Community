import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeController.js';
import { auth } from '../middleware/auth.js';
import { geminiRateLimit } from '../middleware/geminiRateLimit.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temp storage

// Rate limit: 5/min, 20/day per user (applied after auth so we can key by user)
router.post('/analyze', auth, geminiRateLimit, upload.single('resume'), analyzeResume);

export default router;
