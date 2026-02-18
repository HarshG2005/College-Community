import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateContentWithRetry } from '../utils/geminiClient.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Helper function to extract text from PDF using pdfjs-dist
async function extractTextFromPDF(dataBuffer) {
    const data = new Uint8Array(dataBuffer);
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText.trim();
}

export const analyzeResume = async (req, res) => {
    try {
        console.log('📂 Analysis request received');

        let text = '';

        if (req.file) {
            console.log('📄 File received:', req.file.path);
            console.log('📄 File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            try {
                const dataBuffer = fs.readFileSync(req.file.path);
                console.log('📄 Buffer size:', dataBuffer.length, 'bytes');

                // Use pdfjs-dist to extract text
                text = await extractTextFromPDF(dataBuffer);
                console.log('📄 Extracted text length:', text.length);
            } catch (pdfError) {
                console.error('❌ PDF Parse Error:', pdfError.message);
                console.error('❌ Error stack:', pdfError.stack);
                return res.status(400).json({ message: 'Failed to parse PDF file. Error: ' + pdfError.message });
            } finally {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
        } else if (req.body.resumeText) {
            text = req.body.resumeText;
        } else {
            return res.status(400).json({ message: 'Please upload a PDF or paste resume text.' });
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'No text content could be extracted.' });
        }

        const jobDescription = req.body.jobDescription || '';

        // --- AI ANALYSIS ---
        try {
            console.log('🔑 Checking API Key:', process.env.GEMINI_API_KEY ? 'Present (' + process.env.GEMINI_API_KEY.length + ' chars)' : 'MISSING');

            if (!process.env.GEMINI_API_KEY) {
                throw new Error('Gemini API Key is missing');
            }

            // Using Gemini 3 Flash (temporarily for testing, can switch back to gemma-3-27b-it)
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const prompt = `
                You are a STRICT and CRITICAL ATS (Application Tracking System) expert and Senior Career Coach.
                Your job is to HARSHLY but FAIRLY evaluate resumes. Most resumes have significant room for improvement.
                
                IMPORTANT CONTEXT FOR INDIAN RESUMES:
                - For Indian freshers and students, Class 10th and 12th scores ARE relevant and should be included
                - Campus placements in India often require 10th/12th percentages
                - Do NOT suggest removing high school scores for freshers or students with less than 2 years experience
                - CGPA, percentage, and academic achievements are valued in Indian hiring
                
                Resume Text:
                """${text.substring(0, 8000)}"""

                Job Description (if provided):
                """${jobDescription.substring(0, 2000)}"""

                IMPORTANT SCORING GUIDELINES (be strict!):
                - 0-40: Very poor. Missing major sections, unprofessional formatting, no relevant keywords.
                - 40-55: Below average. Generic content, weak action verbs, lacks quantified achievements.
                - 55-70: Average. Has basics but needs significant improvement in keywords and metrics.
                - 70-80: Good. Solid resume but missing some optimization for ATS or specific role.
                - 80-90: Very good. Well-optimized, strong keywords, quantified achievements.
                - 90-100: Exceptional. RARE. Only for perfectly tailored resumes with outstanding achievements.
                
                MOST resumes should score between 45-75. Be critical!

                Respond ONLY with valid JSON (no markdown, no explanation):
                {
                    "score": <number 0-100, be strict>,
                    "scoreExplanation": "<2-3 sentence explanation of why this score>",
                    "foundKeywords": [<array of 5-10 relevant technical skills/keywords found>],
                    "missingKeywords": [<array of 5-8 important keywords that SHOULD be there but are missing>],
                    "strengths": [<array of 2-3 specific things done well>],
                    "weaknesses": [<array of 2-3 specific critical issues>],
                    "suggestions": [<array of 4-6 SPECIFIC, ACTIONABLE improvements with examples>],
                    "details": {
                        "contact": { "email": <boolean>, "phone": <boolean>, "linkedin": <boolean>, "github": <boolean> },
                        "sections": [<array of section names detected like 'Education', 'Experience', 'Skills'>],
                        "textLength": <number of characters>
                    }
                }
            `;

            const result = await generateContentWithRetry(model, prompt);
            const response = await result.response;
            const textResponse = response.text();

            // Clean up code blocks if present
            const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

            const analysisData = JSON.parse(cleanJson);

            res.json(analysisData);

        } catch (aiError) {
            fs.appendFileSync('gemini_error.log', `[${new Date().toISOString()}] AI Error: ${aiError.message}\n${JSON.stringify(aiError, null, 2)}\n\n`);
            console.error('⚠️ AI Analysis Failed:', aiError.message);
            console.error('Full Error Details:', JSON.stringify(aiError, null, 2));
            // console.error(aiError); 

            // Fallback to basic logic if AI fails
            const basicResults = performBasicAnalysis(text, jobDescription);
            res.json(basicResults);
        }
    } catch (error) {
        console.error('❌ Resume analysis failed:', error);
        res.status(500).json({ message: 'Failed to analyze resume', error: error.message });
    }
};

// --- FALLBACK LOGIC (Previous Implementation) ---
const KEYWORDS = {
    development: ['react', 'node', 'express', 'mongodb', 'typescript', 'javascript', 'html', 'css', 'redux', 'next.js', 'sql', 'python', 'java', 'c++', 'aws', 'docker'],
    data: ['sql', 'nosql', 'python', 'pandas', 'numpy', 'tableau', 'power bi'],
    soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'agile'],
    action: ['developed', 'led', 'engineered', 'implemented', 'designed', 'created', 'optimized']
};

const SECTIONS = ['education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'summary'];

function performBasicAnalysis(text, jobDescription) {
    // ... (Keep existing strict logic as fallback)
    const found = [];
    const missing = [];
    const suggestions = [];
    let score = 20;

    const normalizedText = text.toLowerCase();

    // Simple Keyword Match
    KEYWORDS.development.forEach(w => {
        if (normalizedText.includes(w)) { found.push(w); score += 1.5; }
    });

    // Cap score
    score = Math.min(80, Math.max(10, score)); // Lower cap for basic analysis

    return {
        score,
        foundKeywords: [...new Set(found)],
        missingKeywords: [],
        suggestions: ['AI Analysis Unavailable. Basic check performed.', 'Add more technical keywords.', 'Ensure standard sections exist.'],
        details: {
            contact: { email: true, phone: true, linkedin: false, github: false },
            sections: ['education', 'skills'],
            textLength: text.length
        }
    };
}
