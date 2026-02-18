import { useState, useRef } from 'react';
import {
    FileText, CheckCircle, AlertCircle, TrendingUp,
    Terminal, Upload, File, Loader2, X
} from 'lucide-react';
import {
    ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import { api } from '../context/AuthContext';

export default function ResumeAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const [inputMethod, setInputMethod] = useState<'pdf' | 'text'>('text');
    const [jobDescription, setJobDescription] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [result, setResult] = useState<{
        score: number;
        missingKeywords: string[];
        foundKeywords: string[];
        suggestions: string[];
        details: any;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalyzed(false);
            setResult(null);
        }
    };

    const analyzeResume = async () => {
        if (inputMethod === 'pdf' && !file) return;
        if (inputMethod === 'text' && !textInput) return;

        setAnalyzing(true);
        const formData = new FormData();

        if (inputMethod === 'pdf' && file) {
            formData.append('resume', file);
        } else if (inputMethod === 'text') {
            formData.append('resumeText', textInput);
        }

        if (jobDescription) formData.append('jobDescription', jobDescription);

        try {
            const res = await api.post('/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            setAnalyzed(true);
        } catch (error) {
            console.error('Analysis failed', error);
            console.error('Analysis failed', error);
            alert('Analysis failed. Please check your file or text input.');
        } finally {
            setAnalyzing(false);
        }
    };

    const scoreData = [
        { name: 'Score', value: result?.score || 0, fill: (result?.score || 0) > 70 ? '#22c55e' : (result?.score || 0) > 40 ? '#eab308' : '#ef4444' }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-900/10 rounded-lg">
                        <Terminal className="w-6 h-6 text-blue-700" />
                    </div>
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Placement Tool</span>
                </div>
                <h1 className="text-3xl font-bold text-[#ebebeb]">Smart ATS Resume Analyzer</h1>
                <p className="text-[#9b9b9b] max-w-2xl">
                    Upload your resume (PDF) to check its ATS compatibility, keyword density, and get AI-driven suggestions to improve your placement chances.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="notion-card p-6">
                        <div className="flex items-center gap-4 mb-4 border-b border-[#333333] pb-2">
                            <button
                                onClick={() => { setFile(null); setInputMethod('pdf'); setTextInput(''); }}
                                className={`text-sm font-semibold pb-2 px-1 transition-colors ${inputMethod === 'pdf' ? 'text-[#10b981] border-b-2 border-[#10b981]' : 'text-[#6b6b6b] hover:text-[#ebebeb]'}`}
                            >
                                Upload PDF
                            </button>
                            <button
                                onClick={() => { setFile(null); setInputMethod('text'); }}
                                className={`text-sm font-semibold pb-2 px-1 transition-colors ${inputMethod === 'text' ? 'text-[#10b981] border-b-2 border-[#10b981]' : 'text-[#6b6b6b] hover:text-[#ebebeb]'}`}
                            >
                                Paste Text
                            </button>
                        </div>

                        {inputMethod === 'pdf' ? (
                            <>
                                <label className="block text-sm font-semibold text-[#ebebeb] mb-3">
                                    Upload Resume (PDF)
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-[#333333] hover:border-[#10b981] hover:bg-[#202020] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="hidden"
                                    />
                                    {file ? (
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <File className="w-6 h-6 text-red-500" />
                                            </div>
                                            <p className="text-sm font-medium text-[#ebebeb]">{file.name}</p>
                                            <p className="text-xs text-[#6b6b6b] mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                className="mt-3 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto"
                                            >
                                                <X className="w-3 h-3" /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-[#252525] group-hover:bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                                                <Upload className="w-6 h-6 text-[#6b6b6b] group-hover:text-[#10b981] transition-colors" />
                                            </div>
                                            <p className="text-sm font-medium text-[#ebebeb]">Click to upload or drag and drop</p>
                                            <p className="text-xs text-[#6b6b6b] mt-1">PDF files only (Max 2MB)</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="block text-sm font-semibold text-[#ebebeb] mb-3">
                                    Paste Resume Content
                                </label>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    className="w-full h-64 bg-[#151515] border border-[#333333] rounded-lg p-4 text-[#ebebeb] text-sm focus:outline-none focus:border-[#10b981] resize-none font-mono"
                                />
                            </>
                        )}
                    </div>

                    <div className="notion-card p-6">
                        <label className="block text-sm font-semibold text-[#ebebeb] mb-3">
                            Job Description (Optional)
                        </label>
                        <p className="text-xs text-[#6b6b6b] mb-3">Paste the JD to check for missing specific keywords.</p>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste job description here..."
                            className="w-full h-32 bg-[#151515] border border-[#333333] rounded-lg p-4 text-[#ebebeb] text-sm focus:outline-none focus:border-[#10b981] resize-none"
                        />
                    </div>

                    <button
                        onClick={analyzeResume}
                        disabled={(inputMethod === 'pdf' && !file) || (inputMethod === 'text' && !textInput.trim()) || analyzing}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                Analyze Resume
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {analyzed && result ? (
                        <>
                            {/* Score Card */}
                            <div className="notion-card p-8 flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-blue-500/5 pointer-events-none" />
                                <h3 className="text-lg font-semibold text-[#ebebeb] mb-4">ATS Compatibility Score</h3>
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart
                                            innerRadius="80%"
                                            outerRadius="100%"
                                            barSize={10}
                                            data={scoreData}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar
                                                background
                                                dataKey="value"
                                                cornerRadius={30}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className={`text-5xl font-bold ${result.score > 70 ? 'text-green-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {result.score}
                                        </span>
                                        <span className="text-xs text-[#6b6b6b] mt-1">out of 100</span>
                                    </div>
                                </div>
                                <p className="text-center text-[#9b9b9b] mt-4 text-sm max-w-xs">
                                    {result.score > 80 ? 'Excellent! Your resume is well-optimized.' :
                                        result.score > 50 ? 'Good start, but needs more keywords and structure.' :
                                            'Needs improvement. Follow the suggestions below.'}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="notion-card p-4">
                                    <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">Sections Detected</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {result.details.sections.map((s: string) => (
                                            <span key={s} className="px-2 py-0.5 bg-[#252525] text-[#ebebeb] text-[10px] rounded uppercase border border-[#333333]">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="notion-card p-4">
                                    <h4 className="text-xs font-semibold text-[#6b6b6b] uppercase mb-2">Contact Info</h4>
                                    <div className="space-y-1">
                                        {Object.entries(result.details.contact).map(([key, valid]) => (
                                            <div key={key} className="flex items-center justify-between text-xs">
                                                <span className="capitalize text-[#9b9b9b]">{key}</span>
                                                {valid ?
                                                    <CheckCircle className="w-3.5 h-3.5 text-green-500" /> :
                                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Keywords Found */}
                            <div className="notion-card p-6">
                                <h3 className="text-sm font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Identified Keywords ({result.foundKeywords.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.foundKeywords.length > 0 ? (
                                        result.foundKeywords.map(word => (
                                            <span key={word} className="px-2.5 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium border border-green-500/20">
                                                {word}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-[#6b6b6b] italic">No technical keywords found.</span>
                                    )}
                                </div>
                            </div>

                            {/* Missing Keywords */}
                            {jobDescription && result.missingKeywords.length > 0 && (
                                <div className="notion-card p-6 border-l-4 border-l-yellow-500/50">
                                    <h3 className="text-sm font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                                        Missing Keywords (from JD)
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.map(word => (
                                            <span key={word} className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-md text-xs font-medium border border-yellow-500/20">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            <div className="notion-card p-6">
                                <h3 className="text-sm font-semibold text-[#ebebeb] mb-4">Improvement Suggestions</h3>
                                <ul className="space-y-3">
                                    {result.suggestions.length > 0 ? (
                                        result.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-[#9b9b9b]">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                {suggestion}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-start gap-3 text-sm text-[#9b9b9b]">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                            Great job! No critical issues found.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center notion-card p-12 text-center opacity-50">
                            <FileText className="w-16 h-16 text-[#333333] mb-4" />
                            <h3 className="text-lg font-medium text-[#ebebeb] mb-2">Ready to Analyze</h3>
                            <p className="text-[#6b6b6b] max-w-xs">
                                Upload your PDF resume on the left to generate a detailed ATS report.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
