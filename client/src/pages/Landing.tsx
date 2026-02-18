import { Link } from 'react-router-dom';
import ThreeHero from '../components/ThreeHero';
import {
    GraduationCap,
    Users,
    BookOpen,
    Calendar,
    Briefcase,
    MessageSquare,
    ArrowRight,
    Bell,
    FileText,
    Zap
} from 'lucide-react';

const features = [
    {
        icon: BookOpen,
        title: 'Study Materials',
        description: 'Share notes, PDFs, and question papers. Subject-wise organization with voting.'
    },
    {
        icon: Calendar,
        title: 'Events',
        description: 'Stay updated with hackathons, workshops, and college activities.'
    },
    {
        icon: Briefcase,
        title: 'Placements',
        description: 'Interview experiences, resources, and job alerts.'
    },
    {
        icon: MessageSquare,
        title: 'Chat',
        description: 'Connect with classmates and discuss in real-time.'
    },
    {
        icon: Bell,
        title: 'Notices',
        description: 'Important announcements and updates in one place.'
    },
    {
        icon: Users,
        title: 'Community',
        description: 'Build connections and find project partners.'
    }
];

const stats = [
    { value: '2500+', label: 'Students' },
    { value: '1000+', label: 'Resources' },
    { value: '50+', label: 'Events' },
    { value: '93%', label: 'Placement Rate' }
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#191919]">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#191919]/95 backdrop-blur-sm border-b border-[#333333]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-base font-semibold text-[#ebebeb]">BMSIT Community</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="btn-ghost">
                                Log in
                            </Link>
                            <Link to="/register" className="btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <ThreeHero />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#202020]/80 backdrop-blur-md border border-[#333333] rounded-full text-sm text-[#9b9b9b] mb-6">
                        <Zap className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>BMSIT&M College Platform</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-[#ebebeb] mb-4 leading-tight">
                        Your college, <span className="text-[#10b981]">one platform</span>
                    </h1>

                    <p className="text-lg text-[#9b9b9b] max-w-xl mx-auto mb-8">
                        A simple, unified space for BMSIT students to share resources,
                        stay updated, and prepare for placements.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
                        <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-2.5">
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/login" className="btn-secondary px-6 py-2.5">
                            I already have an account
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="notion-card p-4 text-center">
                                <div className="text-2xl font-semibold text-[#ebebeb]">{stat.value}</div>
                                <div className="text-sm text-[#6b6b6b]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 border-t border-[#333333]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-[#ebebeb] text-center mb-3">
                        Everything you need
                    </h2>
                    <p className="text-[#9b9b9b] text-center mb-12 max-w-lg mx-auto">
                        All your college activities in one place.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="notion-card p-5">
                                <div className="w-10 h-10 rounded-lg bg-[#252525] flex items-center justify-center mb-3">
                                    <feature.icon className="w-5 h-5 text-[#9b9b9b]" />
                                </div>
                                <h3 className="text-base font-medium text-[#ebebeb] mb-1">{feature.title}</h3>
                                <p className="text-sm text-[#6b6b6b]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 px-6 border-t border-[#333333]">
                <div className="max-w-3xl mx-auto">
                    <div className="notion-card p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-[#6b6b6b]" />
                                    <span className="text-sm text-[#6b6b6b]">Built with</span>
                                </div>
                                <h2 className="text-xl font-semibold text-[#ebebeb] mb-2">
                                    Modern MERN Stack
                                </h2>
                                <p className="text-sm text-[#9b9b9b] mb-4">
                                    React, Node.js, Express, MongoDB, and Socket.io for real-time features.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind'].map((tech) => (
                                        <span key={tech} className="badge-gray">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="w-20 h-20 rounded-xl bg-[#252525] flex items-center justify-center">
                                <Zap className="w-10 h-10 text-[#10b981]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 border-t border-[#333333]">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-semibold text-[#ebebeb] mb-3">
                        Ready to get started?
                    </h2>
                    <p className="text-[#9b9b9b] mb-6">
                        Join your college community today.
                    </p>
                    <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
                        Create account
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#333333] py-6 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#10b981] rounded flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-[#ebebeb]">BMSIT Community</span>
                    </div>
                    <p className="text-xs text-[#6b6b6b]">
                        © 2026 BMSIT&M College Community Platform
                    </p>
                </div>
            </footer>
        </div>
    );
}
