import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import Materials from './pages/Materials';
import Events from './pages/Events';
import Placement from './pages/Placement';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CGPACalculator from './pages/CGPACalculator';
import AcademicCalendar from './pages/AcademicCalendar';
import PlacementPredictor from './pages/PlacementPredictor';
import SkillTest from './pages/SkillTest';
import StudyPlanner from './pages/StudyPlanner';
import AgentStudyPlanner from './pages/AgentStudyPlanner';
import AgentAssistant from './pages/AgentAssistant';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="spinner w-10 h-10"></div>
            </div>
        );
    }

    return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Admin Route component
function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="spinner w-10 h-10"></div>
            </div>
        );
    }

    // Allow if user is admin, else redirect to dashboard
    return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

// Public Route component (redirect if logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="spinner w-10 h-10"></div>
            </div>
        );
    }

    return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function App() {
    return (
        <div className="min-h-screen bg-dark-950">
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } />
                </Route>

                {/* Protected routes */}
                <Route element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/notices" element={<Notices />} />
                    <Route path="/materials" element={<Materials />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/placement" element={<Placement />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                    <Route path="/cgpa-calculator" element={<CGPACalculator />} />
                    <Route path="/calendar" element={<AcademicCalendar />} />
                    <Route path="/placement-predictor" element={<PlacementPredictor />} />
                    <Route path="/skill-test" element={<SkillTest />} />
                    <Route path="/study-planner" element={<StudyPlanner />} />
                    <Route path="/ai-study-planner" element={<AgentStudyPlanner />} />
                    <Route path="/agent-assistant" element={<AgentAssistant />} />

                    {/* Admin Route */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
