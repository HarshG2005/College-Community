import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen, Calendar, Clock, check, CheckCircle, Circle,
    BrainCircuit, Zap, RefreshCw, ChevronDown, ChevronRight,
    PlayCircle, FileText, AlertCircle
} from 'lucide-react';

interface Resource {
    title: string;
    url: string;
    type: string;
}

interface DayPlan {
    dayNumber: number;
    topic: string;
    description: string;
    resources: Resource[];
    isCompleted: boolean;
    timeSpent: number;
    _id: string;
}

interface WeekPlan {
    weekNumber: number;
    focus: string;
    days: DayPlan[];
    _id: string;
}

interface StudyPlan {
    _id: string;
    subject: string;
    goal: string;
    weeks: WeekPlan[];
    progress: {
        totalTopics: number;
        completedTopics: number;
        percentage: number;
    };
    agentLog: { action: string; details: string; timestamp: string }[];
}

const StudyPlanner: React.FC = () => {
    const { token } = useAuth();
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
    const [showWizard, setShowWizard] = useState(false);

    // Wizard State
    const [formData, setFormData] = useState({
        subject: '',
        goal: '',
        level: 'Beginner',
        daysPerWeek: 5,
        hoursPerDay: 2
    });

    const [generating, setGenerating] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);

    useEffect(() => {
        fetchPlans();
    }, [token]);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/study-planner/my-plans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPlans(data);
            if (data.length > 0) setActivePlan(data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const res = await fetch('/api/study-planner/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const newPlan = await res.json();
            setPlans([newPlan, ...plans]);
            setActivePlan(newPlan);
            setShowWizard(false);
        } catch (err) {
            alert('Failed to generate plan');
        } finally {
            setGenerating(false);
        }
    };

    const toggleDayCompletion = async (weekNumber: number, dayNumber: number, currentStatus: boolean) => {
        if (!activePlan) return;

        // Optimistic update
        const updatedPlans = plans.map(p => {
            if (p._id === activePlan._id) {
                const newWeeks = p.weeks.map(w => {
                    if (w.weekNumber === weekNumber) {
                        return {
                            ...w,
                            days: w.days.map(d =>
                                d.dayNumber === dayNumber ? { ...d, isCompleted: !currentStatus } : d
                            )
                        };
                    }
                    return w;
                });
                return { ...p, weeks: newWeeks };
            }
            return p;
        });
        setPlans(updatedPlans);
        setActivePlan(updatedPlans.find(p => p._id === activePlan._id) || null);

        try {
            const res = await fetch('/api/study-planner/progress', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: activePlan._id,
                    weekNumber,
                    dayNumber,
                    isCompleted: !currentStatus
                })
            });
            const updatedPlan = await res.json();
            // Update with server response to ensure stats are correct
            setPlans(plans.map(p => p._id === updatedPlan._id ? updatedPlan : p));
            setActivePlan(updatedPlan);
        } catch (err) {
            console.error(err);
            fetchPlans(); // Revert on error
        }
    };

    const handleAgentSync = async () => {
        if (!activePlan) return;
        setSyncing(true);
        try {
            const res = await fetch('/api/study-planner/sync-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ planId: activePlan._id })
            });
            const data = await res.json();

            if (data.newPlan) {
                setPlans(plans.map(p => p._id === data.newPlan._id ? data.newPlan : p));
                setActivePlan(data.newPlan);
                alert(`🤖 Agent Action: ${data.message}`);
            } else {
                alert(`🤖 Agent: ${data.message}`);
            }
        } catch (err) {
            alert('Agent failed to sync');
        } finally {
            setSyncing(false);
        }
    };

    const toggleWeek = (weekNum: number) => {
        setExpandedWeeks(prev =>
            prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
        );
    };

    if (loading) return <div className="p-8 text-center text-[#9b9b9b]">Loading planner...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#ebebeb] flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-[#10b981]" />
                        AI Study Coach
                    </h1>
                    <p className="text-[#9b9b9b] mt-1">Agentic tracking & autonomous scheduling</p>
                </div>
                <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-[#0f0f0f] font-semibold rounded-lg hover:bg-[#059669] transition"
                >
                    <Zap className="w-5 h-5" />
                    New Study Plan
                </button>
            </div>

            {!activePlan && !showWizard ? (
                <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-[#252525]">
                    <BookOpen className="w-16 h-16 text-[#333] mx-auto mb-4" />
                    <h2 className="text-xl text-[#ebebeb] mb-2">No active study plans</h2>
                    <p className="text-[#9b9b9b] mb-6">Let the AI agent create a personalized schedule for you.</p>
                    <button
                        onClick={() => setShowWizard(true)}
                        className="px-6 py-2 bg-[#10b981] text-[#0f0f0f] rounded-lg font-medium"
                    >
                        Create First Plan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Plan List */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#252525]">
                            <h3 className="text-[#ebebeb] font-semibold mb-4">My Plans</h3>
                            <div className="space-y-2">
                                {plans.map(plan => (
                                    <button
                                        key={plan._id}
                                        onClick={() => setActivePlan(plan)}
                                        className={`w-full text-left p-3 rounded-lg transition ${activePlan?._id === plan._id
                                                ? 'bg-[#10b981]/10 border border-[#10b981]/50 text-[#10b981]'
                                                : 'bg-[#252525] text-[#9b9b9b] hover:bg-[#333]'
                                            }`}
                                    >
                                        <div className="font-medium">{plan.subject}</div>
                                        <div className="text-xs mt-1 opacity-70">{plan.progress.percentage}% Complete</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Agent Stats */}
                        {activePlan && (
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#10b981]/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <BrainCircuit className="w-24 h-24 text-[#10b981]" />
                                </div>
                                <h3 className="text-[#10b981] font-semibold mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Agent Status
                                </h3>
                                <div className="text-sm text-[#ebebeb] space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-[#9b9b9b]">Monitoring:</span>
                                        <span className="text-green-400">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#9b9b9b]">Last Check:</span>
                                        <span>Just now</span>
                                    </div>
                                    <button
                                        onClick={handleAgentSync}
                                        disabled={syncing}
                                        className="w-full mt-3 py-2 bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] rounded text-xs font-medium flex items-center justify-center gap-2 transition"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                                        {syncing ? 'Agent Optimizing...' : 'Force Agent Re-sync'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Agent Log */}
                        {activePlan && activePlan.agentLog.length > 0 && (
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#252525]">
                                <h3 className="text-[#ebebeb] text-sm font-semibold mb-3">Agent Activity Log</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                                    {activePlan.agentLog.slice().reverse().map((log, i) => (
                                        <div key={i} className="text-xs border-l-2 border-[#10b981] pl-3 py-1">
                                            <div className="text-[#10b981] font-medium">{log.action}</div>
                                            <div className="text-[#9b9b9b] mt-0.5">{log.details.substring(0, 60)}...</div>
                                            <div className="text-[#555] mt-1">{new Date(log.timestamp).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content - Timeline */}
                    <div className="lg:col-span-3">
                        {activePlan && (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#252525]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-[#ebebeb]">{activePlan.subject}</h2>
                                            <p className="text-[#9b9b9b]">{activePlan.goal}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-[#10b981]">{activePlan.progress.percentage}%</div>
                                            <div className="text-sm text-[#555]">Completed</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#252525] h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#10b981] h-full transition-all duration-500"
                                            style={{ width: `${activePlan.progress.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Weeks */}
                                {activePlan.weeks.map(week => (
                                    <div key={week.weekNumber} className="bg-[#1a1a1a] rounded-xl border border-[#252525] overflow-hidden">
                                        <button
                                            onClick={() => toggleWeek(week.weekNumber)}
                                            className="w-full flex items-center justify-between p-4 bg-[#252525]/50 hover:bg-[#252525] transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981] font-bold text-sm">
                                                    W{week.weekNumber}
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-[#ebebeb] font-medium">{week.focus}</h3>
                                                    <p className="text-xs text-[#9b9b9b]">{week.days.filter(d => d.isCompleted).length}/{week.days.length} days done</p>
                                                </div>
                                            </div>
                                            {expandedWeeks.includes(week.weekNumber) ? <ChevronDown className="text-[#9b9b9b]" /> : <ChevronRight className="text-[#9b9b9b]" />}
                                        </button>

                                        {expandedWeeks.includes(week.weekNumber) && (
                                            <div className="p-4 space-y-4">
                                                {week.days.map((day) => (
                                                    <div key={day.dayNumber} className={`relative pl-8 pb-4 border-l-2 ${day.isCompleted ? 'border-[#10b981]' : 'border-[#333]'} last:pb-0`}>
                                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${day.isCompleted ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#1a1a1a] border-[#555]'} flex items-center justify-center`}>
                                                            {day.isCompleted && <check className="w-3 h-3 text-black" />}
                                                        </div>

                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1">
                                                                <h4 className={`font-semibold ${day.isCompleted ? 'text-[#10b981] line-through' : 'text-[#ebebeb]'}`}>
                                                                    Day {day.dayNumber}: {day.topic}
                                                                </h4>
                                                                <p className="text-sm text-[#9b9b9b] mt-1 mb-2">{day.description}</p>

                                                                {/* Resources */}
                                                                {day.resources.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        {day.resources.map((res, i) => (
                                                                            <a
                                                                                key={i}
                                                                                href={res.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-1.5 px-3 py-1 bg-[#252525] hover:bg-[#333] rounded-full text-xs text-[#10b981] transition border border-[#10b981]/20"
                                                                            >
                                                                                {res.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                                                {res.title}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                onClick={() => toggleDayCompletion(week.weekNumber, day.dayNumber, day.isCompleted)}
                                                                className={`p-2 rounded-lg transition ${day.isCompleted
                                                                        ? 'bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20'
                                                                        : 'bg-[#252525] text-[#555] hover:bg-[#333] hover:text-[#9b9b9b]'
                                                                    }`}
                                                            >
                                                                {day.isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Wizard Modal */}
            {showWizard && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#252525] w-full max-w-lg relative">
                        <button
                            onClick={() => setShowWizard(false)}
                            className="absolute top-4 right-4 text-[#555] hover:text-[#ebebeb]"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center justify-center mx-auto mb-4">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#ebebeb]">Create AI Study Plan</h2>
                            <p className="text-[#9b9b9b]">Tell the Agent what you want to master.</p>
                        </div>

                        <form onSubmit={handleCreatePlan} className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#9b9b9b] mb-1">Subject / Skill</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. React Native, Machine Learning, DSA"
                                    className="w-full bg-[#252525] border border-[#333] rounded-lg p-3 text-[#ebebeb] focus:border-[#10b981] outline-none"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#9b9b9b] mb-1">Specific Goal</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Build a mobile app, Crack Google Interview"
                                    className="w-full bg-[#252525] border border-[#333] rounded-lg p-3 text-[#ebebeb] focus:border-[#10b981] outline-none"
                                    value={formData.goal}
                                    onChange={e => setFormData({ ...formData, goal: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-1">Current Level</label>
                                    <select
                                        className="w-full bg-[#252525] border border-[#333] rounded-lg p-3 text-[#ebebeb] focus:border-[#10b981] outline-none"
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-1">Hours / Day</label>
                                    <input
                                        type="number"
                                        min="1" max="12"
                                        className="w-full bg-[#252525] border border-[#333] rounded-lg p-3 text-[#ebebeb] focus:border-[#10b981] outline-none"
                                        value={formData.hoursPerDay}
                                        onChange={e => setFormData({ ...formData, hoursPerDay: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={generating}
                                className="w-full py-4 bg-[#10b981] text-[#0f0f0f] font-bold rounded-lg hover:bg-[#059669] transition flex items-center justify-center gap-2 mt-4"
                            >
                                {generating ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Generating Plan...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Generate Plan with Gemini
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyPlanner;
