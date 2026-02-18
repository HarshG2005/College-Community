import { useAuth, api } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import {
    BookOpen,
    Calendar,
    Bell,
    Briefcase,
    Clock,
    FileText,
    Users,
    ArrowRight,
    MessageSquare,
    Target,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notice {
    _id: string;
    title: string;
    createdAt: string;
}

interface Event {
    _id: string;
    title: string;
    date: string;
    category: string;
}

interface Material {
    _id: string;
    title: string;
    subject: string;
    createdAt: string;
}

const quickActions = [
    { icon: Bell, label: 'Notices', path: '/notices' },
    { icon: BookOpen, label: 'Materials', path: '/materials' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Briefcase, label: 'Placements', path: '/placement' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Users, label: 'Profile', path: '/profile' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [activePlan, setActivePlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [noticesRes, eventsRes, materialsRes] = await Promise.all([
                    api.get('/notices'),
                    api.get('/events'),
                    api.get('/materials')
                ]);
                setNotices(noticesRes.data.notices?.slice(0, 4) || []);
                setEvents(eventsRes.data.events?.slice(0, 3) || []);
                setMaterials(materialsRes.data.materials?.slice(0, 4) || []);

                // Fetch Plans separately to avoid blocking
                try {
                    const plansRes = await api.get('/study-planner/my-plans');
                    console.log('Plans Response:', plansRes.data);
                    if (plansRes.data && plansRes.data.length > 0) {
                        setActivePlan(plansRes.data[0]);
                    } else {
                        console.log('No plans found in DB response');
                    }
                } catch (planError) {
                    console.error('Failed to fetch plans:', planError);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return formatDate(dateStr);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#ebebeb] mb-1">
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-[#6b6b6b]">
                    {user?.branch} • Year {user?.year}
                </p>
            </div>

            {/* Active Study Plan (Agent) */}
            {activePlan && (
                <div className="mb-8">
                    <h2 className="text-sm font-medium text-[#6b6b6b] mb-3 uppercase tracking-wide">Active Goal</h2>
                    <div className="notion-card p-5 bg-gradient-to-r from-[#252525] to-[#1e1e1e] border-l-4 border-l-[#10b981]">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-[#ebebeb] flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#10b981]" />
                                    {activePlan.goal}
                                </h3>
                                <p className="text-sm text-[#9b9b9b] mt-1">
                                    {activePlan.subject} • {activePlan.weeks.length} Weeks
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-xs text-[#6b6b6b]">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4 text-[#10b981]" />
                                        {activePlan.progress?.percentage || 0}% Completed
                                    </span>
                                    <span>
                                        Started {new Date(activePlan.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Link to="/study-planner" className="px-4 py-2 bg-[#10b981] text-white text-sm rounded hover:bg-[#059669] transition-colors">
                                Continue Learning
                            </Link>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-4 h-1.5 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#10b981] transition-all duration-500"
                                style={{ width: `${activePlan.progress?.percentage || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Debug Info (Temporary) */}
            {!activePlan && !loading && (
                <div className="text-xs text-red-500 mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <strong>Debug Info:</strong> No Active Plan Found.
                    </div>
                    <p>Please checks "Agentic Coach". Ensure you clicked "Execute".</p>
                </div>
            )}

            {/* ERROR / STATE DUMP */}
            {activePlan && (
                <details className="mb-4 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded">
                    <summary>Debug: Active Plan Data (Click to expand)</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {JSON.stringify(activePlan, null, 2)}
                    </pre>
                </details>
            )}

            {/* Active Study Plan (Agent) */}
            <div className="mb-8">
                <h2 className="text-sm font-medium text-[#6b6b6b] mb-3 uppercase tracking-wide">Quick Actions</h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.path}
                            to={action.path}
                            className="notion-card p-4 text-center hover:bg-[#252525]"
                        >
                            <action.icon className="w-5 h-5 text-[#9b9b9b] mx-auto mb-2" />
                            <span className="text-xs text-[#9b9b9b]">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Notices */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide">Recent Notices</h2>
                            <Link to="/notices" className="text-xs text-[#10b981] hover:underline">View all</Link>
                        </div>
                        <div className="notion-card divide-y divide-[#333333]">
                            {notices.length > 0 ? notices.map((notice) => (
                                <div key={notice._id} className="p-4 hover:bg-[#252525]">
                                    <div className="flex items-start gap-3">
                                        <Bell className="w-4 h-4 text-[#6b6b6b] mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-[#ebebeb] truncate">{notice.title}</p>
                                            <p className="text-xs text-[#6b6b6b] mt-1">
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {formatTimeAgo(notice.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-4 text-sm text-[#6b6b6b]">No notices yet</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide">Upcoming Events</h2>
                            <Link to="/events" className="text-xs text-[#10b981] hover:underline">View all</Link>
                        </div>
                        <div className="notion-card divide-y divide-[#333333]">
                            {events.length > 0 ? events.map((event) => (
                                <div key={event._id} className="p-4 hover:bg-[#252525]">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-[#252525] rounded flex flex-col items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-[#6b6b6b]">{formatDate(event.date).split(' ')[0]}</span>
                                            <span className="text-sm font-semibold text-[#ebebeb]">{formatDate(event.date).split(' ')[1]}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-[#ebebeb] truncate">{event.title}</p>
                                            <span className="inline-block mt-1 badge-gray text-xs">{event.category}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-4 text-sm text-[#6b6b6b]">No events scheduled</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Materials */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide">Recent Study Materials</h2>
                            <Link to="/materials" className="text-xs text-[#10b981] hover:underline">View all</Link>
                        </div>
                        <div className="notion-card divide-y divide-[#333333]">
                            {materials.length > 0 ? materials.map((material) => (
                                <div key={material._id} className="p-4 hover:bg-[#252525]">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-[#6b6b6b] flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-[#ebebeb] truncate">{material.title}</p>
                                        </div>
                                        <span className="badge-gray text-xs flex-shrink-0">{material.subject}</span>
                                        <ArrowRight className="w-4 h-4 text-[#6b6b6b]" />
                                    </div>
                                </div>
                            )) : (
                                <p className="p-4 text-sm text-[#6b6b6b]">No materials yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
