import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Calendar, Mail, Lightbulb, Loader2, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'agent_assistant_messages';

const defaultMessages = [
    { role: 'agent', content: "Hello! I'm your College AI Assistant. I can help you with project ideas, check upcoming events, or send announcements. How can I help you today?" }
];

const AgentAssistant = () => {
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultMessages;
        } catch {
            return defaultMessages;
        }
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const clearChat = () => {
        setMessages(defaultMessages);
        localStorage.removeItem(STORAGE_KEY);
    };

    const handleSend = async (messageText?: string) => {
        const text = messageText || input;
        if (!text.trim()) return;

        const userMessage = { role: 'user', content: text };
        setMessages((prev: any[]) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 1. Initialize Agent with Goal
            await fetch('/api/agent/init', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ goal: text })
            });

            // 2. Ask for Plan
            const planRes = await fetch('/api/agent/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const planData = await planRes.json();

            if (!planRes.ok) {
                throw new Error(planData.message || 'Planning failed');
            }

            // 3. Execute
            const execRes = await fetch('/api/agent/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const execData = await execRes.json();

            // Format results for the chat
            let responseContent = "I've completed the task!";
            if (execData.results && execData.results.length > 0) {
                const parts = execData.results.map((r: any) => {
                    if (r.status === 'success' && r.result) {
                        // If it's project ideas, format them nicely
                        if (r.result.data && Array.isArray(r.result.data)) {
                            const ideas = r.result.data;
                            return ideas.map((idea: any, i: number) =>
                                `**${i + 1}. ${idea.title}**\n${idea.description}\n🛠 Tech: ${idea.technologies?.join(', ')}\n⚡ Difficulty: ${idea.difficulty}`
                            ).join('\n\n');
                        }
                        return r.result.message || 'Done!';
                    } else {
                        return `⚠️ ${r.error || 'An error occurred'}`;
                    }
                });
                responseContent = parts.join('\n\n');
            }

            setMessages((prev: any[]) => [...prev, { role: 'agent', content: responseContent }]);

        } catch (error: any) {
            setMessages((prev: any[]) => [...prev, {
                role: 'agent',
                content: `Sorry, I encountered an error: ${error.message}. Please try again.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto flex flex-col h-[80vh] notion-card overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[#252525] bg-[#1a1a1a] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#10b981]/20 p-2 rounded-lg">
                            <Bot className="w-6 h-6 text-[#10b981]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#ebebeb]">AI Assistant</h1>
                            <p className="text-xs text-[#6b6b6b]">Agentic Intelligence Online</p>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        title="Clear conversation"
                        className="p-2 text-[#6b6b6b] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#333333]' : 'bg-[#10b981]/10 border border-[#10b981]/20'}`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-[#9b9b9b]" /> : <Bot className="w-4 h-4 text-[#10b981]" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-[#10b981] text-white'
                                    : 'bg-[#1a1a1a] border border-[#252525] text-[#ebebeb]'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 items-center bg-[#1a1a1a] border border-[#252525] p-4 rounded-2xl">
                                <Loader2 className="w-4 h-4 text-[#10b981] animate-spin" />
                                <span className="text-sm text-[#6b6b6b]">Agent is thinking and taking action...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-[#252525] bg-[#1a1a1a]">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Ask me to suggest project ideas or send an announcement..."
                            className="flex-1 bg-[#252525] border border-[#333333] rounded-xl px-4 py-3 text-[#ebebeb] focus:outline-none focus:border-[#10b981] transition-colors"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading}
                            className="bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white p-3 rounded-xl transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Quick Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button
                            onClick={() => handleSend("Suggest 5 project ideas for Fullstack Web Development")}
                            className="text-xs bg-[#252525] hover:bg-[#333333] text-[#9b9b9b] px-3 py-1.5 rounded-full border border-[#333333] flex items-center gap-2"
                        >
                            <Lightbulb className="w-3 h-3" /> Project Ideas
                        </button>
                        <button
                            onClick={() => handleSend("Check upcoming events for the next 7 days")}
                            className="text-xs bg-[#252525] hover:bg-[#333333] text-[#9b9b9b] px-3 py-1.5 rounded-full border border-[#333333] flex items-center gap-2"
                        >
                            <Calendar className="w-3 h-3" /> Upcoming Events
                        </button>
                        <button
                            onClick={() => handleSend("Post a notice: Reminder - Internal Assessment exams start next week. Please prepare accordingly.")}
                            className="text-xs bg-[#252525] hover:bg-[#333333] text-[#9b9b9b] px-3 py-1.5 rounded-full border border-[#333333] flex items-center gap-2"
                        >
                            <Mail className="w-3 h-3" /> Post Announcement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentAssistant;
