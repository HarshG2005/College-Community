import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, CheckCircle, XCircle, Loader2, Brain, Target, Lightbulb, BarChart3, Code, BookOpen, Award, Briefcase, ClipboardCheck } from 'lucide-react';

interface PredictionResult {
    placed: boolean;
    probability: {
        not_placed: number;
        placed: number;
    };
    confidence: number;
    tips: string[];
    feature_importance: Record<string, number>;
}

interface TestScores {
    dsa: { score: number; completedAt: string } | null;
    communication: { score: number; completedAt: string } | null;
}

const BMSIT_BRANCHES = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'ISE', label: 'Information Science & Engineering' },
    { value: 'AIML', label: 'AI & Machine Learning' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'ETE', label: 'Electronics & Telecommunication' },
    { value: 'Mechanical', label: 'Mechanical Engineering' },
    { value: 'Civil', label: 'Civil Engineering' }
];

const PlacementPredictor = () => {
    const navigate = useNavigate();
    const [testScores, setTestScores] = useState<TestScores | null>(null);
    const [formData, setFormData] = useState({
        branch: 'CSE',
        gender: 'Male',
        cgpa: '',
        backlogs: 0,
        dsa_score: 50,
        projects: 1,
        leetcode_problems: 0,
        certifications: 0,
        internship: false,
        communication_score: 3
    });

    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch test scores on mount
    useEffect(() => {
        const fetchTestScores = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('/api/skill-tests/my-scores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTestScores(data.scores);
                    // Auto-fill DSA and Communication scores from tests
                    if (data.scores.dsa) {
                        setFormData(prev => ({ ...prev, dsa_score: data.scores.dsa.score }));
                    }
                    if (data.scores.communication) {
                        setFormData(prev => ({ ...prev, communication_score: Math.round(data.scores.communication.score / 20) }));
                    }
                }
            } catch (error) {
                console.error('Error fetching test scores:', error);
            }
        };
        fetchTestScores();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting form...", formData);

        if (!formData.cgpa) {
            setError("CGPA is required");
            return;
        }

        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const payload = {
                Branch: formData.branch,
                Gender: formData.gender,
                CGPA: parseFloat(formData.cgpa),
                Backlogs: formData.backlogs,
                DSA_Score: formData.dsa_score,
                Projects: formData.projects,
                LeetCode_Problems: formData.leetcode_problems,
                Certifications: formData.certifications,
                Internship: formData.internship,
                Communication_Score: formData.communication_score
            };

            const response = await fetch('http://localhost:5001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Prediction failed');
            }

            const result = await response.json();
            console.log("Prediction Result:", result);
            setPrediction(result);
        } catch (err: any) {
            console.error("Submission Error:", err);
            setError(err.message || 'Failed to get prediction. Make sure the ML API is running on port 5001.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Brain className="w-10 h-10 text-[#10b981]" />
                        <h1 className="text-3xl font-bold text-[#ebebeb]">BMSIT Placement Predictor</h1>
                    </div>
                    <p className="text-[#9b9b9b]">AI-Powered Placement Prediction for BMSIT Students</p>
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full">
                        <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                        <span className="text-xs text-[#10b981]">Trained on 2000+ BMSIT-like profiles</span>
                    </div>
                </div>

                {/* Test Scores Banner */}
                <div className="notion-card p-4 mb-6 border-[#10b981]/30">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <ClipboardCheck className="w-6 h-6 text-[#10b981]" />
                            <div>
                                <p className="text-sm font-semibold text-[#ebebeb]">Skill Tests Available</p>
                                <p className="text-xs text-[#9b9b9b]">Take DSA & Communication tests for more accurate predictions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {testScores?.dsa ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-xs text-green-400">DSA: {testScores.dsa.score}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
                                    <AlertCircle className="w-4 h-4 text-orange-400" />
                                    <span className="text-xs text-orange-400">DSA: Not taken</span>
                                </div>
                            )}
                            {testScores?.communication ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-xs text-green-400">Comm: {testScores.communication.score}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
                                    <AlertCircle className="w-4 h-4 text-orange-400" />
                                    <span className="text-xs text-orange-400">Comm: Not taken</span>
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/skill-test')}
                                className="px-4 py-2 bg-[#10b981] hover:bg-[#0d9668] text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                Take Tests
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="notion-card p-6">
                        <h2 className="text-lg font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#10b981]" />
                            Enter Your Profile
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Branch & Gender */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-2">Branch</label>
                                    <select
                                        value={formData.branch}
                                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                        className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                    >
                                        {BMSIT_BRANCHES.map(b => (
                                            <option key={b.value} value={b.value}>{b.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Academic */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-2">CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="4"
                                        max="10"
                                        value={formData.cgpa}
                                        onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                                        className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                        placeholder="e.g. 8.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-2">Active Backlogs</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={formData.backlogs}
                                        onChange={e => setFormData({ ...formData, backlogs: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Technical Skills */}
                            <div className="border-t border-[#333333] pt-4 mt-4">
                                <h3 className="text-sm font-medium text-[#ebebeb] mb-3 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-[#10b981]" />
                                    Technical Skills
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="flex justify-between text-sm text-[#9b9b9b] mb-2">
                                            <span>DSA Proficiency</span>
                                            <span className="text-[#10b981]">{formData.dsa_score}/100</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData.dsa_score}
                                            onChange={e => setFormData({ ...formData, dsa_score: parseInt(e.target.value) })}
                                            className="w-full accent-[#10b981]"
                                        />
                                        <div className="flex justify-between text-xs text-[#6b6b6b] mt-1">
                                            <span>Beginner</span>
                                            <span>Intermediate</span>
                                            <span>Expert</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-[#9b9b9b] mb-2">Projects Built</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={formData.projects}
                                                onChange={e => setFormData({ ...formData, projects: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#9b9b9b] mb-2">LeetCode Problems</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="1000"
                                                value={formData.leetcode_problems}
                                                onChange={e => setFormData({ ...formData, leetcode_problems: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional */}
                            <div className="border-t border-[#333333] pt-4 mt-4">
                                <h3 className="text-sm font-medium text-[#ebebeb] mb-3 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-[#10b981]" />
                                    Additional Info
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm text-[#9b9b9b] mb-2">Certifications</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={formData.certifications}
                                            onChange={e => setFormData({ ...formData, certifications: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex justify-between text-sm text-[#9b9b9b] mb-2">
                                            <span>Communication</span>
                                            <span className="text-[#10b981]">{formData.communication_score}/5</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={formData.communication_score}
                                            onChange={e => setFormData({ ...formData, communication_score: parseInt(e.target.value) })}
                                            className="w-full accent-[#10b981]"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.internship}
                                        onChange={e => setFormData({ ...formData, internship: e.target.checked })}
                                        className="w-4 h-4 rounded border-[#333333] bg-[#252525] text-[#10b981] focus:ring-[#10b981]"
                                    />
                                    <Briefcase className="w-4 h-4 text-[#9b9b9b]" />
                                    <span className="text-sm text-[#9b9b9b]">Have completed an internship</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !formData.cgpa}
                                className="w-full flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0d9668] text-white font-semibold py-3 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-5 h-5" />
                                        Predict Placement
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        {error && (
                            <div className="notion-card p-4 border-red-500/30 bg-red-500/10">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {prediction && (
                            <>
                                {/* Main Result */}
                                <div className={`notion-card p-6 ${prediction.placed
                                    ? 'bg-gradient-to-br from-green-500/10 to-[#1a1a1a] border-green-500/30'
                                    : 'bg-gradient-to-br from-orange-500/10 to-[#1a1a1a] border-orange-500/30'
                                    }`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        {prediction.placed ? (
                                            <CheckCircle className="w-12 h-12 text-green-400" />
                                        ) : (
                                            <XCircle className="w-12 h-12 text-orange-400" />
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-[#ebebeb]">
                                                {prediction.placed ? 'Likely to be Placed! 🎉' : 'Needs Improvement'}
                                            </h3>
                                            <p className="text-sm text-[#9b9b9b]">
                                                {prediction.confidence}% confidence
                                            </p>
                                        </div>
                                    </div>

                                    {/* Probability Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-400">Placed: {prediction.probability.placed}%</span>
                                            <span className="text-orange-400">Not Placed: {prediction.probability.not_placed}%</span>
                                        </div>
                                        <div className="h-3 bg-[#252525] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                                                style={{ width: `${prediction.probability.placed}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tips */}
                                {prediction.tips && prediction.tips.length > 0 && (
                                    <div className="notion-card p-6">
                                        <h3 className="text-lg font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                                            Personalized Tips
                                        </h3>
                                        <div className="space-y-3">
                                            {prediction.tips.map((tip, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm text-[#9b9b9b] bg-[#1a1a1a] p-3 rounded-lg">
                                                    <span>{tip}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Feature Importance */}
                                {prediction.feature_importance && (
                                    <div className="notion-card p-6">
                                        <h3 className="text-lg font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-[#10b981]" />
                                            What Matters Most
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(prediction.feature_importance)
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 6)
                                                .map(([feature, importance]) => (
                                                    <div key={feature}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-[#9b9b9b]">{feature.replace(/_/g, ' ')}</span>
                                                            <span className="text-[#10b981]">{importance}%</span>
                                                        </div>
                                                        <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#10b981] transition-all duration-500"
                                                                style={{ width: `${importance}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {!prediction && !error && (
                            <div className="notion-card p-6 text-center">
                                <TrendingUp className="w-12 h-12 text-[#333333] mx-auto mb-3" />
                                <p className="text-[#6b6b6b]">Fill in your details and click "Predict Placement" to see your results</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-8 text-center text-[#6b6b6b] text-sm">
                    <p>Model trained on BMSIT-like student profiles with India-specific hiring parameters</p>
                    <p className="mt-1">Features: Branch, CGPA, DSA Skills, Projects, LeetCode Practice, Certifications, Communication</p>
                </div>
            </div>
        </div>
    );
};

export default PlacementPredictor;
