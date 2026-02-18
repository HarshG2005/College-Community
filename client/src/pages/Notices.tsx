import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Bell, Search, ThumbsUp, MessageSquare, Clock } from 'lucide-react';

interface Notice {
    _id: string;
    title: string;
    content: string;
    category: 'academic' | 'event' | 'placement' | 'general';
    author: { name: string };
    likes: string[];
    comments: { user: string; text: string }[];
    createdAt: string;
}

const categories = ['All', 'Academic', 'Event', 'Placement', 'General'];

export default function Notices() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const res = await api.get('/notices');
                setNotices(res.data.notices || []);
            } catch (error) {
                console.error('Failed to fetch notices');
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' ||
            notice.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'academic': return 'badge-blue';
            case 'event': return 'badge-yellow';
            case 'placement': return 'badge-green';
            default: return 'badge-gray';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#ebebeb] mb-1">Notices</h1>
                <p className="text-[#6b6b6b]">Important announcements and updates</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-2 text-sm rounded-md whitespace-nowrap transition-colors ${selectedCategory === category
                                    ? 'bg-[#2f2f2f] text-[#ebebeb]'
                                    : 'text-[#6b6b6b] hover:bg-[#252525]'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notices List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : filteredNotices.length === 0 ? (
                <div className="text-center py-12">
                    <Bell className="w-10 h-10 text-[#333333] mx-auto mb-3" />
                    <p className="text-[#6b6b6b]">No notices found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotices.map((notice) => (
                        <div key={notice._id} className="notion-card p-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <span className={`${getCategoryBadge(notice.category)} mb-2 inline-block`}>
                                        {notice.category}
                                    </span>
                                    <h3 className="text-base font-medium text-[#ebebeb]">{notice.title}</h3>
                                </div>
                            </div>

                            <p className="text-sm text-[#9b9b9b] mb-4 line-clamp-2">{notice.content}</p>

                            <div className="flex items-center justify-between text-xs text-[#6b6b6b]">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        {notice.likes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {notice.comments?.length || 0}
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(notice.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
