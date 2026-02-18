import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Calendar, Search, MapPin, Clock, Users } from 'lucide-react';

interface Event {
    _id: string;
    title: string;
    description: string;
    category: 'hackathon' | 'workshop' | 'seminar' | 'cultural' | 'sports' | 'other';
    date: string;
    time: string;
    venue: string;
    organizer: string;
    participants: string[];
    maxParticipants: number;
}

const categories = ['All', 'Hackathon', 'Workshop', 'Seminar', 'Cultural', 'Sports'];

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await api.get('/events');
                setEvents(res.data.events || []);
            } catch (error) {
                console.error('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' ||
            event.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-IN', { month: 'short' }),
            full: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
        };
    };

    const getParticipantCount = (event: Event) => {
        return Array.isArray(event.participants) ? event.participants.length : 0;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#ebebeb] mb-1">Events</h1>
                <p className="text-[#6b6b6b]">Upcoming hackathons, workshops, and college activities</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                    <input
                        type="text"
                        placeholder="Search events..."
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

            {/* Events List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-10 h-10 text-[#333333] mx-auto mb-3" />
                    <p className="text-[#6b6b6b]">No events found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredEvents.map((event) => {
                        const dateInfo = formatDate(event.date);
                        const participantCount = getParticipantCount(event);
                        const spotsLeft = event.maxParticipants - participantCount;

                        return (
                            <div key={event._id} className="notion-card p-5">
                                <div className="flex gap-4">
                                    {/* Date Box */}
                                    <div className="w-14 h-14 bg-[#252525] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                                        <span className="text-xs text-[#6b6b6b] uppercase">{dateInfo.month}</span>
                                        <span className="text-xl font-semibold text-[#ebebeb]">{dateInfo.day}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <span className="badge-gray text-xs mb-1 inline-block">{event.category}</span>
                                                <h3 className="text-base font-medium text-[#ebebeb]">{event.title}</h3>
                                            </div>
                                            <button className="btn-primary text-xs px-3 py-1.5 flex-shrink-0">
                                                Register
                                            </button>
                                        </div>

                                        <p className="text-sm text-[#9b9b9b] mb-3 line-clamp-1">{event.description}</p>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b6b6b]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {event.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {event.venue}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" />
                                                {participantCount}/{event.maxParticipants} • {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
