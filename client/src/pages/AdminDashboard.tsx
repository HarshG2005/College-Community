import { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import {
    Users, FileText, Calendar, MessageSquare, TrendingUp,
    AlertCircle, CheckCircle, Shield, Search, MoreVertical
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activePosts: 0,
        upcomingEvents: 0,
        reportedContent: 0
    });
    const [pieData, setPieData] = useState([
        { name: 'Students', value: 0 },
        { name: 'Faculty', value: 0 },
        { name: 'Alumni', value: 0 },
        { name: 'Admins', value: 0 }
    ]);
    const [activityChart, setActivityChart] = useState<any[]>([]);
    const [recentActions, setRecentActions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            const data = res.data;
            setStats(data.stats);
            setPieData(data.pieData);
            setActivityChart(data.activityChart);
            setRecentActions(data.recentActions);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="content-wrapper flex items-center justify-center h-64">
                <div className="text-[#9b9b9b] animate-pulse">Loading dashboard data...</div>
            </div>
        );
    }

    return (
        <div className="content-wrapper space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#ebebeb] mb-1">Admin Dashboard</h1>
                    <p className="text-[#9b9b9b]">Live overview of platform activity</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchStats} className="btn-secondary flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="notion-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#ebebeb] mb-1">{stats.totalUsers}</h3>
                    <p className="text-sm text-[#9b9b9b]">Total Users</p>
                </div>

                <div className="notion-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <FileText className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#ebebeb] mb-1">{stats.activePosts}</h3>
                    <p className="text-sm text-[#9b9b9b]">Total Notices</p>
                </div>

                <div className="notion-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <Calendar className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#ebebeb] mb-1">{stats.upcomingEvents}</h3>
                    <p className="text-sm text-[#9b9b9b]">Upcoming Events</p>
                </div>

                <div className="notion-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#ebebeb] mb-1">{pieData.find(p => p.name === 'Admins')?.value || 0}</h3>
                    <p className="text-sm text-[#9b9b9b]">Admin Users</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <div className="lg:col-span-2 notion-card p-6">
                    <h3 className="text-lg font-semibold text-[#ebebeb] mb-6">Notice Activity (Last 7 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityChart}>
                                <defs>
                                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#6b6b6b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b6b6b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#252525', border: '1px solid #333333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ebebeb' }}
                                />
                                <CartesianGrid stroke="#333333" strokeDasharray="3 3" vertical={false} />
                                <Area type="monotone" dataKey="posts" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPosts)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Distribution */}
                <div className="lg:col-span-1 notion-card p-6">
                    <h3 className="text-lg font-semibold text-[#ebebeb] mb-6">User Distribution</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#252525', border: '1px solid #333333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ebebeb' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-sm text-[#9b9b9b]">{entry.name}: {entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="notion-card overflow-hidden">
                <div className="p-6 border-b border-[#333333] flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#ebebeb]">Recent Notices</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#202020] text-[#9b9b9b] text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333333]">
                            {recentActions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[#6b6b6b]">No recent activity</td>
                                </tr>
                            ) : recentActions.map((action, i) => (
                                <tr key={i} className="hover:bg-[#252525] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-[#ebebeb] text-xs font-bold">
                                                {action.user?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[#ebebeb]">{action.user || 'System'}</div>
                                                <div className="text-xs text-[#6b6b6b]">{action.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#9b9b9b] max-w-xs truncate">{action.action}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded-full">
                                            {action.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#9b9b9b]">
                                        {new Date(action.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
