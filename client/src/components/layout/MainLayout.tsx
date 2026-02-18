import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Bell,
    BookOpen,
    Calendar,
    Briefcase,
    MessageSquare,
    User,
    LogOut,
    Menu,
    GraduationCap,
    Shield,
    Calculator,
    CalendarDays,
    Brain,
    BrainCircuit,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/notices', icon: Bell, label: 'Notices' },
    { path: '/materials', icon: BookOpen, label: 'Study Materials' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/placement', icon: Briefcase, label: 'Placement' },
    { path: '/placement-predictor', icon: Brain, label: 'ML Predictor' },
    { path: '/study-planner', icon: Brain, label: 'Study Agent' },
    { path: '/ai-study-planner', icon: BrainCircuit, label: 'Agentic Coach' },
    { path: '/resume-analyzer', icon: Shield, label: 'Resume ATS' },
    { path: '/cgpa-calculator', icon: Calculator, label: 'CGPA Calculator' },
    { path: '/calendar', icon: CalendarDays, label: 'Academic Calendar' },
    { path: '/agent-assistant', icon: Sparkles, label: 'AI Assistant' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    // Admin route
    { path: '/admin', icon: Shield, label: 'Admin Panel', adminOnly: true },
];

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#191919] flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#202020] border-r border-[#333333]
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b border-[#333333]">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold text-[#ebebeb]">BMSIT Community</h1>
                                <p className="text-[10px] text-[#9b9b9b]">College Platform</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                        {navItems.map((item) => {
                            // Hide admin links for non-admin users
                            if (item.adminOnly && user?.role !== 'admin') return null;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) => `
                      sidebar-link
                      ${isActive ? 'active' : 'text-[#9b9b9b] hover:bg-[#252525] hover:text-[#ebebeb]'}
                    `}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-3 border-t border-[#333333]">
                        <NavLink
                            to="/profile"
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                flex items-center gap-3 p-2 rounded-lg mb-1
                ${isActive ? 'bg-[#2f2f2f] text-[#ebebeb]' : 'text-[#9b9b9b] hover:bg-[#252525] hover:text-[#ebebeb]'}
                transition-all duration-200
              `}
                        >
                            <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center">
                                <span className="text-xs font-semibold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-[#6b6b6b] truncate">{user?.email}</p>
                            </div>
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[#9b9b9b] rounded-lg hover:bg-[#2f2020] hover:text-[#ff6b6b] transition-all duration-200 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar (mobile) */}
                <header className="lg:hidden sticky top-0 z-30 bg-[#202020] border-b border-[#333333] px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-1.5 text-[#9b9b9b] hover:text-[#ebebeb] rounded hover:bg-[#252525]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#10b981] rounded flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-[#ebebeb] text-sm">BMSIT</span>
                        </div>
                        <div className="w-8" /> {/* Spacer */}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto bg-[#191919]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
