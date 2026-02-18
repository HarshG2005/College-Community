import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BrainCircuit, Zap, CheckCircle, XCircle, Terminal,
    Send, Loader, MessageSquare, BookOpen, PlayCircle
} from 'lucide-react';

interface AgentStep {
    tool: string;
    params: any;
    reasoning: string;
}

interface LogEntry {
    role: string;
    content: string;
    timestamp: string;
}

const AgentStudyPlanner: React.FC = () => {
    const { token } = useAuth();
    const [goal, setGoal] = useState('');
    const [status, setStatus] = useState<'idle' | 'thinking' | 'review' | 'executing' | 'done'>('idle');
    const [plan, setPlan] = useState<AgentStep[] | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Auto-scroll logs
    const logEndRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (role: string, content: string) => {
        setLogs(prev => [...prev, { role, content, timestamp: new Date().toLocaleTimeString() }]);
    };

    const handleInit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setStatus('thinking');
        setLogs([]); // Clear previous logs
        addLog('user', `Goal: ${goal}`);
        addLog('system', 'Initializing Agent Brain...');

        try {
            // 1. Init
            await fetch('/api/agent/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ goal })
            });

            // 2. Plan
            addLog('brain', 'Requesting Plan from LLM Planner...');
            const planRes = await fetch('/api/agent/plan', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const planData = await planRes.json();

            if (planData.plan) {
                setPlan(planData.plan);
                setStatus('review');
                addLog('planner', 'Plan generated. Waiting for user approval.');
            } else {
                addLog('error', 'Planner failed to return a valid plan.');
                setStatus('idle');
            }

        } catch (error) {
            addLog('error', 'Agent connection failed.');
            setStatus('idle');
        }
    };

    const handleExecute = async () => {
        setStatus('executing');
        addLog('user', 'Plan Approved. Executing...');

        try {
            const res = await fetch('/api/agent/execute', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            data.results.forEach((r: any) => {
                if (r.status === 'success') {
                    addLog('tool', `Executed ${r.step.tool}: Success`);
                } else {
                    addLog('error', `Failed ${r.step.tool}: ${r.error}`);
                }
            });

            setStatus('done');
            addLog('brain', 'Mission Complete.');
        } catch (error) {
            addLog('error', 'Execution interrupted.');
            setStatus('review');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#ebebeb] flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-blue-500" />
                        Agentic Study Planner
                    </h1>
                    <p className="text-[#9b9b9b]">Autonomous Goal Planner & Executor (Beta)</p>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Mode: {status.toUpperCase()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Left: Input & Interaction */}
                <div className="lg:col-span-1 flex flex-col gap-4 bg-[#1a1a1a] p-6 rounded-xl border border-[#252525]">
                    <h2 className="text-xl font-semibold text-[#ebebeb]">Mission Control</h2>

                    <form onSubmit={handleInit} className="space-y-4">
                        <div>
                            <label className="text-sm text-[#9b9b9b]">What do you want to learn?</label>
                            <textarea
                                className="w-full h-32 bg-[#252525] border border-[#333] rounded-lg p-3 text-[#ebebeb] focus:border-blue-500 outline-none mt-2 resize-none"
                                placeholder="e.g. Master Linear Algebra for Machine Learning in 2 weeks..."
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                disabled={status !== 'idle' && status !== 'done'}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status !== 'idle' && status !== 'done'}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                        >
                            {status === 'thinking' ? <Loader className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                            {status === 'thinking' ? 'Thinking...' : 'Initialize Agent'}
                        </button>
                    </form>

                    <div className="flex-1 bg-[#0f0f0f] rounded-lg p-4 font-mono text-xs overflow-y-auto custom-scrollbar border border-[#333]">
                        <div className="flex items-center gap-2 text-[#9b9b9b] mb-2 border-b border-[#333] pb-2">
                            <Terminal className="w-3 h-3" /> Agent Terminal
                        </div>
                        <div className="space-y-2">
                            {logs.map((log, i) => (
                                <div key={i} className={`flex gap-2 ${log.role === 'error' ? 'text-red-400' :
                                    log.role === 'brain' ? 'text-purple-400' :
                                        log.role === 'planner' ? 'text-yellow-400' :
                                            log.role === 'tool' ? 'text-green-400' :
                                                'text-[#ebebeb]'
                                    }`}>
                                    <span className="opacity-50">[{log.timestamp}]</span>
                                    <span className="font-bold">{log.role.toUpperCase()}:</span>
                                    <span>{log.content}</span>
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                    </div>
                </div>

                {/* Right: Plan Visualization */}
                <div className="lg:col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-[#252525] flex flex-col relative overflow-hidden">
                    <h2 className="text-xl font-semibold text-[#ebebeb] mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Proposed Plan
                    </h2>

                    {!plan ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#555] opacity-50">
                            <BrainCircuit className="w-24 h-24 mb-4" />
                            <p>Waiting for Agent Plan...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                            {plan.map((step, idx) => (
                                <div key={idx} className="bg-[#252525] p-4 rounded-lg border border-[#333]">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-mono uppercase">
                                            {step.tool}
                                        </span>
                                        <span className="text-[#555] text-xs">Step {idx + 1}</span>
                                    </div>
                                    <p className="text-[#ebebeb] text-sm mb-3 font-medium bg-[#1a1a1a] p-2 rounded">
                                        params: {JSON.stringify(step.params)}
                                    </p>
                                    <p className="text-[#9b9b9b] text-xs italic">
                                        " {step.reasoning} "
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Bar */}
                    {status === 'review' && (
                        <div className="mt-6 pt-6 border-t border-[#333] flex gap-4">
                            <button
                                onClick={() => { setStatus('idle'); setPlan(null); addLog('user', 'Plan Rejected.'); }}
                                className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg flex items-center justify-center gap-2 transition"
                            >
                                <XCircle className="w-5 h-5" /> Reject Plan
                            </button>
                            <button
                                onClick={handleExecute}
                                className="flex-1 py-3 bg-green-500 text-black hover:bg-green-600 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20"
                            >
                                <CheckCircle className="w-5 h-5" /> Approve & Execute
                            </button>
                        </div>
                    )}

                    {status === 'executing' && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="text-center">
                                <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white">Agent Executing Plans...</h3>
                                <p className="text-gray-400 mt-2">Please wait while tools are called.</p>
                            </div>
                        </div>
                    )}

                    {status === 'done' && (
                        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
                            ✅ Plan executed successfully! Check your main dashboard.
                            <div className="mt-4">
                                <Link
                                    to="/study-planner"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition shadow-lg shadow-green-500/20"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    View Full Schedule
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentStudyPlanner;
