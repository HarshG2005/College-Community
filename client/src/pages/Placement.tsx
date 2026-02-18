import { useState } from 'react';
import {
    Briefcase, TrendingUp, Users, Building, Download,
    ExternalLink, Search, ChevronRight, Award, DollarSign
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Legend
} from 'recharts';

// Real Official Data from BMSIT Placement Cell (as on 12-04-2025)
// Source: bmsit.ac.in/training-and-placement

// Placement Data for Last Five Years (from official chart)
const placementStats = [
    { year: '2021', enrolled: 551, placed: 458, percentage: 83.12 },
    { year: '2022', enrolled: 789, placed: 699, percentage: 88.59 },
    { year: '2023', enrolled: 843, placed: 786, percentage: 93.24 },
    { year: '2024', enrolled: 819, placed: 798, percentage: 97.44 },
    { year: '2025*', enrolled: 1027, placed: 658, percentage: 64.07 }, // In Progress
];

// Branch Wise Placement Statistics of 2025 Batch (as on 12-04-2025)
const branchWiseStats = [
    { branch: 'AI&ML', registered: 58, placed: 47, percentage: 81.03, highest: 23.00, lowest: 3.25, average: 8.72 },
    { branch: 'CSE', registered: 203, placed: 153, percentage: 75.37, highest: 33.00, lowest: 3.25, average: 9.31 },
    { branch: 'ISE', registered: 208, placed: 169, percentage: 81.25, highest: 28.00, lowest: 3.25, average: 8.49 },
    { branch: 'ECE', registered: 142, placed: 94, percentage: 66.20, highest: 26.35, lowest: 3.25, average: 7.53 },
    { branch: 'EEE', registered: 55, placed: 30, percentage: 54.55, highest: 23.00, lowest: 3.25, average: 5.54 },
    { branch: 'ETE', registered: 47, placed: 31, percentage: 65.96, highest: 9.00, lowest: 3.25, average: 5.31 },
    { branch: 'MECH', registered: 34, placed: 23, percentage: 67.65, highest: 4.60, lowest: 3.50, average: 2.46 },
    { branch: 'CIVIL', registered: 31, placed: 26, percentage: 83.87, highest: 7.50, lowest: 3.60, average: 4.68 },
    { branch: 'MCA', registered: 110, placed: 34, percentage: 30.91, highest: 12.00, lowest: 4.00, average: 5.98 },
    { branch: 'MBA', registered: 114, placed: 40, percentage: 35.09, highest: 12.00, lowest: 4.00, average: 6.00 },
    { branch: 'M.Tech', registered: 25, placed: 11, percentage: 44.00, highest: 10.00, lowest: 4.00, average: 5.50 },
];

// Internship Statistics
const internshipStats = [
    { year: '2024', total: 1303, paid: 601, minStipend: 10000, maxStipend: 50000 },
    { year: '2023', total: 1246, paid: 663, minStipend: 12000, maxStipend: 80000 },
];

const companyData = [
    { name: 'Amazon', offer: '33 LPA', role: 'SDE' },
    { name: 'Cisco', offer: '28+ LPA', role: 'Network Engineer' },
    { name: 'SAP Labs', offer: '23 LPA', role: 'Associate Developer' },
    { name: 'Adobe', offer: '26 LPA', role: 'MTS' },
    { name: 'Infosys', offer: '6.5 LPA', role: 'SE' },
    { name: 'TCS', offer: '7 LPA', role: 'ASE' },
    { name: 'Wipro', offer: '5 LPA', role: 'Project Engineer' },
    { name: 'Accenture', offer: '6 LPA', role: 'ASE' },
];

const interviewExperiences = [
    {
        id: 1,
        company: 'Amazon',
        role: 'SDE Intern',
        author: 'Aditya Kumar',
        batch: '2024',
        difficulty: 'Hard',
        rounds: 4,
        excerpt: 'The process started with an online assessment covering DP and Graphs...'
    },
    {
        id: 2,
        company: 'Cisco',
        role: 'Consulting Engineer',
        author: 'Priya Sharma',
        batch: '2024',
        difficulty: 'Medium',
        rounds: 3,
        excerpt: 'Focused heavily on computer networks and operating systems concepts...'
    },
    {
        id: 3,
        company: 'SAP Labs',
        role: 'Scholar',
        author: 'Rahul Verma',
        batch: '2024',
        difficulty: 'Medium-Hard',
        rounds: 3,
        excerpt: 'Questions revolved around OOPs, DBMS, and one coding problem...'
    }
];

export default function Placement() {
    const [activeTab, setActiveTab] = useState<'stats' | 'experiences'>('stats');

    return (
        <div className="content-wrapper space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#6b6b6b] text-sm mb-2">
                    <span>Academics</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#ebebeb]">Placement</span>
                </div>
                <h1 className="text-4xl font-bold text-[#ebebeb]">Placement Cell</h1>
                <p className="text-lg text-[#9b9b9b] max-w-3xl">
                    Detailed insights into BMSIT&M's placement records, success stories, and interview experiences.
                </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="notion-card p-6 group hover:border-[#10b981] transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                            <Award className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-xs font-semibold text-[#6b6b6b]">2023 Batch</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#ebebeb] mb-1">93%</h3>
                    <p className="text-sm text-[#9b9b9b]">Placement Record</p>
                </div>

                <div className="notion-card p-6 group hover:border-[#10b981] transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <DollarSign className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-xs font-semibold text-[#6b6b6b]">Highest</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#ebebeb] mb-1">₹46.40 LPA</h3>
                    <p className="text-sm text-[#9b9b9b]">Highest Package</p>
                </div>

                <div className="notion-card p-6 group hover:border-[#10b981] transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-900/10 rounded-lg group-hover:bg-blue-900/20 transition-colors">
                            <TrendingUp className="w-6 h-6 text-blue-700" />
                        </div>
                        <span className="text-xs font-semibold text-[#6b6b6b]">Average</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#ebebeb] mb-1">₹8.97 LPA</h3>
                    <p className="text-sm text-[#9b9b9b]">Average Package</p>
                </div>

                <div className="notion-card p-6 group hover:border-[#10b981] transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                            <Building className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className="text-xs font-semibold text-[#6b6b6b]">Recruiters</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#ebebeb] mb-1">300+</h3>
                    <p className="text-sm text-[#9b9b9b]">Visiting Companies</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-[#333333]">
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'stats' ? 'text-[#ebebeb]' : 'text-[#6b6b6b] hover:text-[#9b9b9b]'
                        }`}
                >
                    Statistics & Trends
                    {activeTab === 'stats' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('experiences')}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'experiences' ? 'text-[#ebebeb]' : 'text-[#6b6b6b] hover:text-[#9b9b9b]'
                        }`}
                >
                    Interview Experiences
                    {activeTab === 'experiences' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]" />
                    )}
                </button>
            </div>

            {/* Content By Tab */}
            {activeTab === 'stats' ? (
                <div className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Enrolled vs Placed Chart */}
                        <div className="notion-card p-6">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-6">Placement Data (Last 5 Years)</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={placementStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                                        <XAxis dataKey="year" stroke="#6b6b6b" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b6b6b" tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#252525', border: '1px solid #333333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#ebebeb' }}
                                            cursor={{ fill: '#ffffff10' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="enrolled" name="Students Enrolled" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                                        <Bar dataKey="placed" name="Students Placed" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-[#6b6b6b] mt-2">* 2025 placements in progress</p>
                        </div>

                        {/* Placement Percentage Trend */}
                        <div className="notion-card p-6">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-6">Placement Rate Trend</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={placementStats}>
                                        <defs>
                                            <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                                        <XAxis dataKey="year" stroke="#6b6b6b" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b6b6b" tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#252525', border: '1px solid #333333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#ebebeb' }}
                                            formatter={(value) => value !== undefined ? [`${Number(value).toFixed(1)}%`, 'Placement Rate'] : ['N/A', 'Placement Rate']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="percentage"
                                            name="Placement %"
                                            stroke="#22c55e"
                                            fillOpacity={1}
                                            fill="url(#colorPercent)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Internship Statistics */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {internshipStats.map((stat) => (
                            <div key={stat.year} className="notion-card p-6">
                                <h3 className="text-lg font-semibold text-[#ebebeb] mb-4">Internship Status {stat.year}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#202020] border border-[#333333] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-[#10b981]">{stat.total}</p>
                                        <p className="text-xs text-[#9b9b9b]">Total Internships</p>
                                    </div>
                                    <div className="bg-[#202020] border border-[#333333] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-green-500">{stat.paid}</p>
                                        <p className="text-xs text-[#9b9b9b]">Paid Internships</p>
                                    </div>
                                    <div className="bg-[#202020] border border-[#333333] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-yellow-500">₹{(stat.minStipend / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-[#9b9b9b]">Min Stipend/month</p>
                                    </div>
                                    <div className="bg-[#202020] border border-[#333333] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-orange-500">₹{(stat.maxStipend / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-[#9b9b9b]">Max Stipend/month</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Top Recruiters Marquee/Grid */}
                    <div className="notion-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-[#ebebeb]">Top Recruiters</h3>
                            <a
                                href="https://bmsit.ac.in/public/assets/pdf/placement/Unique%20Company%20List_18.07.2025.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-[#10b981] hover:underline flex items-center gap-1"
                            >
                                View all companies <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {companyData.map((co) => (
                                <div key={co.name} className="bg-[#202020] border border-[#333333] rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                    <span className="font-bold text-[#ebebeb] text-lg">{co.name}</span>
                                    <span className="text-xs text-[#9b9b9b]">{co.role}</span>
                                    <span className="text-xs text-green-500 mt-1">{co.offer}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Branch-wise Placement Statistics */}
                    <div className="notion-card p-6 overflow-x-auto">
                        <h3 className="text-lg font-semibold text-[#ebebeb] mb-6">Branch-wise Placement Statistics (2023-24)</h3>
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-[#333333]">
                                    <th className="text-left py-3 px-4 text-[#9b9b9b] font-medium">Branch</th>
                                    <th className="text-center py-3 px-4 text-[#9b9b9b] font-medium">Placed</th>
                                    <th className="text-center py-3 px-4 text-[#9b9b9b] font-medium">Total</th>
                                    <th className="text-center py-3 px-4 text-[#9b9b9b] font-medium">%</th>
                                    <th className="text-right py-3 px-4 text-[#9b9b9b] font-medium">Highest (LPA)</th>
                                    <th className="text-right py-3 px-4 text-[#9b9b9b] font-medium">Average (LPA)</th>
                                    <th className="text-right py-3 px-4 text-[#9b9b9b] font-medium">Lowest (LPA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branchWiseStats.map((row, idx) => (
                                    <tr key={row.branch} className={`border-b border-[#252525] hover:bg-[#202020] ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : ''}`}>
                                        <td className="py-3 px-4 text-[#ebebeb] font-semibold">{row.branch}</td>
                                        <td className="py-3 px-4 text-center text-[#ebebeb]">{row.placed}</td>
                                        <td className="py-3 px-4 text-center text-[#9b9b9b]">{row.registered}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.percentage >= 80 ? 'bg-green-500/20 text-green-400' :
                                                row.percentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {row.percentage.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-green-400 font-medium">₹{row.highest}</td>
                                        <td className="py-3 px-4 text-right text-[#10b981]">₹{row.average}</td>
                                        <td className="py-3 px-4 text-right text-orange-400">₹{row.lowest}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-xs text-[#6b6b6b] mt-4">
                            * Official data from BMSIT&M Placement Cell (as on 12-04-2025). 2025 batch placements in progress.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Experiences List */}
                    <div className="grid gap-4">
                        {interviewExperiences.map((exp) => (
                            <div key={exp.id} className="notion-card p-6 hover:border-[#404040] transition-colors cursor-pointer group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#ebebeb] group-hover:text-[#10b981] transition-colors">
                                            {exp.company} - {exp.role}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-[#9b9b9b]">
                                            <span>{exp.author}</span>
                                            <span>•</span>
                                            <span>{exp.batch} Batch</span>
                                            <span>•</span>
                                            <span className={`px-2 py-0.5 rounded textxs font-medium ${exp.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' :
                                                exp.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-green-500/10 text-green-500'
                                                }`}>
                                                {exp.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#6b6b6b] group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="mt-3 text-[#9b9b9b] text-sm line-clamp-2">
                                    {exp.excerpt}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
