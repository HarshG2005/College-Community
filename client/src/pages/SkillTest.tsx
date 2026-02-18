import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, Code, MessageSquare, Loader2, AlertCircle, BarChart3 } from 'lucide-react';
import { dsaQuestions, communicationQuestions } from '../data/testQuestions';

type TestType = 'dsa' | 'communication' | null;

interface Answer {
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
}

const SkillTest = () => {
    const navigate = useNavigate();
    const [testType, setTestType] = useState<TestType>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedScore, setSavedScore] = useState<number | null>(null);
    const [existingScores, setExistingScores] = useState<any>(null);

    const questions = testType === 'dsa' ? dsaQuestions : communicationQuestions;
    const testTime = testType === 'dsa' ? 30 * 60 : 20 * 60; // 30 min DSA, 20 min Communication

    // Fetch existing scores on mount
    useEffect(() => {
        const fetchScores = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('/api/skill-tests/my-scores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setExistingScores(data.scores);
                }
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        };
        fetchScores();
    }, []);

    // Timer
    useEffect(() => {
        if (!testStarted || showResult) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, showResult]);

    const startTest = (type: TestType) => {
        setTestType(type);
        setTimeLeft(type === 'dsa' ? 30 * 60 : 20 * 60);
        setTestStarted(true);
        setCurrentQuestion(0);
        setAnswers([]);
        setSelectedOption(null);
        setShowResult(false);
    };

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
    };

    const handleNext = () => {
        if (selectedOption !== null) {
            const question = questions[currentQuestion];
            const answer: Answer = {
                questionId: question.id,
                selectedOption,
                isCorrect: selectedOption === question.correctAnswer
            };

            const existingIndex = answers.findIndex(a => a.questionId === question.id);
            if (existingIndex >= 0) {
                const newAnswers = [...answers];
                newAnswers[existingIndex] = answer;
                setAnswers(newAnswers);
            } else {
                setAnswers([...answers, answer]);
            }
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            // Load existing answer if any
            const nextQuestion = questions[currentQuestion + 1];
            const existingAnswer = answers.find(a => a.questionId === nextQuestion.id);
            setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            const prevQuestion = questions[currentQuestion - 1];
            const existingAnswer = answers.find(a => a.questionId === prevQuestion.id);
            setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
        }
    };

    const handleSubmitTest = useCallback(async () => {
        // Save current answer if selected
        if (selectedOption !== null) {
            const question = questions[currentQuestion];
            const answer: Answer = {
                questionId: question.id,
                selectedOption,
                isCorrect: selectedOption === question.correctAnswer
            };
            const existingIndex = answers.findIndex(a => a.questionId === question.id);
            if (existingIndex >= 0) {
                answers[existingIndex] = answer;
            } else {
                answers.push(answer);
            }
        }

        const correctCount = answers.filter(a => a.isCorrect).length;
        const score = Math.round((correctCount / questions.length) * 100);

        setShowResult(true);
        setSavedScore(score);

        // Save to backend
        const token = localStorage.getItem('token');
        if (token) {
            setSaving(true);
            try {
                await fetch('/api/skill-tests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        testType,
                        score,
                        totalQuestions: questions.length,
                        correctAnswers: correctCount,
                        timeTaken: testTime - timeLeft,
                        answers
                    })
                });
            } catch (error) {
                console.error('Error saving test:', error);
            }
            setSaving(false);
        }
    }, [answers, currentQuestion, questions, selectedOption, testTime, testType, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    // Test Selection Screen
    if (!testType) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Brain className="w-10 h-10 text-[#10b981]" />
                            <h1 className="text-3xl font-bold text-[#ebebeb]">Skill Assessment Tests</h1>
                        </div>
                        <p className="text-[#9b9b9b]">Take tests to assess your skills and improve your placement prediction accuracy</p>
                    </div>

                    {/* Existing Scores */}
                    {existingScores && (
                        <div className="notion-card p-6 mb-8">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Your Current Scores
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                                    <Code className="w-6 h-6 text-[#10b981] mx-auto mb-2" />
                                    <p className="text-sm text-[#9b9b9b]">DSA Score</p>
                                    {existingScores.dsa ? (
                                        <p className={`text-2xl font-bold ${getScoreColor(existingScores.dsa.score)}`}>
                                            {existingScores.dsa.score}%
                                        </p>
                                    ) : (
                                        <p className="text-sm text-[#6b6b6b]">Not taken</p>
                                    )}
                                </div>
                                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                                    <MessageSquare className="w-6 h-6 text-[#10b981] mx-auto mb-2" />
                                    <p className="text-sm text-[#9b9b9b]">Communication Score</p>
                                    {existingScores.communication ? (
                                        <p className={`text-2xl font-bold ${getScoreColor(existingScores.communication.score)}`}>
                                            {existingScores.communication.score}%
                                        </p>
                                    ) : (
                                        <p className="text-sm text-[#6b6b6b]">Not taken</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* DSA Test Card */}
                        <div className="notion-card p-6 hover:border-[#10b981] transition-colors cursor-pointer" onClick={() => startTest('dsa')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-[#10b981]/20 rounded-xl flex items-center justify-center">
                                    <Code className="w-7 h-7 text-[#10b981]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#ebebeb]">DSA Test</h3>
                                    <p className="text-sm text-[#9b9b9b]">Data Structures & Algorithms</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-[#9b9b9b] mb-4">
                                <p>📝 20 Questions</p>
                                <p>⏱️ 30 Minutes</p>
                                <p>📊 Topics: Arrays, Trees, Graphs, DP, Sorting</p>
                            </div>
                            <button className="w-full bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                Start DSA Test
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Communication Test Card */}
                        <div className="notion-card p-6 hover:border-[#10b981] transition-colors cursor-pointer" onClick={() => startTest('communication')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-[#10b981]/20 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-7 h-7 text-[#10b981]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#ebebeb]">Communication Test</h3>
                                    <p className="text-sm text-[#9b9b9b]">Grammar & Professional Skills</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-[#9b9b9b] mb-4">
                                <p>📝 15 Questions</p>
                                <p>⏱️ 20 Minutes</p>
                                <p>📊 Topics: Grammar, Vocabulary, Email Writing</p>
                            </div>
                            <button className="w-full bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                Start Communication Test
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Link to Placement Predictor */}
                    <div className="mt-8 text-center">
                        <p className="text-[#6b6b6b] mb-2">Your test scores will be used in the Placement Predictor</p>
                        <button
                            onClick={() => navigate('/placement-predictor')}
                            className="text-[#10b981] hover:underline flex items-center gap-2 mx-auto"
                        >
                            Go to Placement Predictor
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Result Screen
    if (showResult) {
        const correctCount = answers.filter(a => a.isCorrect).length;
        const score = savedScore || Math.round((correctCount / questions.length) * 100);

        return (
            <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className={`notion-card p-8 text-center ${score >= 60 ? 'border-green-500/30' : 'border-orange-500/30'}`}>
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${score >= 60 ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                            {score >= 60 ? (
                                <Trophy className="w-10 h-10 text-green-400" />
                            ) : (
                                <AlertCircle className="w-10 h-10 text-orange-400" />
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-[#ebebeb] mb-2">Test Completed!</h2>
                        <p className="text-[#9b9b9b] mb-6">{testType === 'dsa' ? 'DSA' : 'Communication'} Assessment</p>

                        <div className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}>
                            {score}%
                        </div>
                        <p className="text-[#9b9b9b] mb-6">
                            {correctCount} out of {questions.length} correct
                        </p>

                        {saving ? (
                            <div className="flex items-center justify-center gap-2 text-[#9b9b9b] mb-6">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving your score...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-green-400 mb-6">
                                <CheckCircle className="w-5 h-5" />
                                Score saved to your profile!
                            </div>
                        )}

                        {/* Question Review */}
                        <div className="mt-8 text-left">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#10b981]" />
                                Review Answers
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {questions.map((q, idx) => {
                                    const answer = answers.find(a => a.questionId === q.id);
                                    const isCorrect = answer?.isCorrect;
                                    const wasAnswered = answer !== undefined;

                                    return (
                                        <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                            <div className="flex items-start gap-2">
                                                {isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <p className="text-sm text-[#ebebeb] font-medium">Q{idx + 1}: {q.question}</p>
                                                    {!isCorrect && (
                                                        <p className="text-xs text-[#9b9b9b] mt-1">
                                                            Correct: <span className="text-green-400">{q.options[q.correctAnswer]}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-[#6b6b6b] mt-1 italic">{q.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setTestType(null)}
                                className="flex-1 bg-[#252525] hover:bg-[#333333] text-[#ebebeb] font-semibold py-3 rounded-lg transition-colors"
                            >
                                Take Another Test
                            </button>
                            <button
                                onClick={() => navigate('/placement-predictor')}
                                className="flex-1 bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                Check Placement Prediction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Test Screen
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="notion-card p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {testType === 'dsa' ? (
                                <Code className="w-6 h-6 text-[#10b981]" />
                            ) : (
                                <MessageSquare className="w-6 h-6 text-[#10b981]" />
                            )}
                            <span className="font-semibold text-[#ebebeb]">
                                {testType === 'dsa' ? 'DSA' : 'Communication'} Test
                            </span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-[#252525] text-[#ebebeb]'}`}>
                            <Clock className="w-4 h-4" />
                            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-[#9b9b9b] mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{question.topic} • {question.difficulty}</span>
                        </div>
                        <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#10b981] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="notion-card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#ebebeb] mb-6">{question.question}</h2>

                    <div className="space-y-3">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedOption === idx
                                    ? 'border-[#10b981] bg-[#10b981]/10 text-[#ebebeb]'
                                    : 'border-[#333333] bg-[#1a1a1a] text-[#9b9b9b] hover:border-[#10b981]/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${selectedOption === idx
                                        ? 'bg-[#10b981] text-white'
                                        : 'bg-[#252525] text-[#9b9b9b]'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-[#252525] hover:bg-[#333333] text-[#ebebeb] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={handleSubmitTest}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Submit Test
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="mt-6 notion-card p-4">
                    <p className="text-sm text-[#9b9b9b] mb-3">Question Navigator</p>
                    <div className="flex flex-wrap gap-2">
                        {questions.map((_, idx) => {
                            const isAnswered = answers.some(a => a.questionId === questions[idx].id);
                            const isCurrent = idx === currentQuestion;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        // Save current answer before navigating
                                        if (selectedOption !== null) {
                                            const question = questions[currentQuestion];
                                            const answer: Answer = {
                                                questionId: question.id,
                                                selectedOption,
                                                isCorrect: selectedOption === question.correctAnswer
                                            };
                                            const existingIndex = answers.findIndex(a => a.questionId === question.id);
                                            if (existingIndex >= 0) {
                                                const newAnswers = [...answers];
                                                newAnswers[existingIndex] = answer;
                                                setAnswers(newAnswers);
                                            } else {
                                                setAnswers([...answers, answer]);
                                            }
                                        }
                                        setCurrentQuestion(idx);
                                        const existingAnswer = answers.find(a => a.questionId === questions[idx].id);
                                        setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
                                    }}
                                    className={`w-8 h-8 rounded text-sm font-medium transition-all ${isCurrent
                                        ? 'bg-[#10b981] text-white'
                                        : isAnswered
                                            ? 'bg-[#10b981]/30 text-[#10b981]'
                                            : 'bg-[#252525] text-[#9b9b9b] hover:bg-[#333333]'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillTest;
