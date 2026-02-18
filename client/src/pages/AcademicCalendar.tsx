import { useState } from 'react';
import { Calendar, GraduationCap, PartyPopper, BookOpen, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// Event Types
type EventType = 'exam' | 'holiday' | 'academic' | 'event';
type Semester = '4th' | '6th' | '8th';

interface CalendarEvent {
    id: number;
    title: string;
    date: string; // YYYY-MM-DD
    endDate?: string; // For multi-day events
    type: EventType;
    description?: string;
}

// B.E. IV Semester 2025-26 (EVEN) - Feb to Jun 2026
const sem4Events: CalendarEvent[] = [
    // February 2026
    { id: 1, title: 'PAC Meeting', date: '2026-02-09', endDate: '2026-02-14', type: 'academic', description: 'PAC Meeting to discuss Delivery methods, Assessment methods, Learning Activities and Rubrics' },
    { id: 2, title: 'IV Semester Classes Begin', date: '2026-02-16', type: 'academic', description: 'Commencement of IV Semester Classes' },
    { id: 3, title: 'Course Registration BE IV Sem', date: '2026-02-16', endDate: '2026-02-18', type: 'academic', description: 'Course Registration of BE IV Semester' },

    // March 2026
    { id: 4, title: 'CCA Announcement', date: '2026-03-14', type: 'academic', description: 'Announcement of Continuous Comprehensive Assessment (CCA) - CCA1 and CCA2' },
    { id: 5, title: 'Faculty Feedback-1', date: '2026-03-16', type: 'event', description: 'Faculty Feedback-1 by Students' },
    { id: 6, title: 'Ugadi', date: '2026-03-19', type: 'holiday', description: 'Kannada New Year' },
    { id: 7, title: 'Mahaveer Jayanthi', date: '2026-03-31', type: 'holiday', description: 'Mahaveer Jayanthi' },

    // April 2026
    { id: 8, title: 'Good Friday', date: '2026-04-03', type: 'holiday', description: 'Good Friday' },
    { id: 9, title: 'IA1 QPs Scrutiny', date: '2026-04-08', type: 'exam', description: 'IA1 Question Papers Scrutiny' },
    { id: 10, title: 'UTSAHA Fest', date: '2026-04-10', endDate: '2026-04-11', type: 'event', description: 'UTSAHA - College Annual Fest' },
    { id: 11, title: 'Ambedkar Jayanthi', date: '2026-04-14', type: 'holiday', description: 'Dr. B.R. Ambedkar Jayanthi' },
    { id: 12, title: 'Internal Assessment 1', date: '2026-04-15', endDate: '2026-04-17', type: 'exam', description: 'Internal Assessment 1 (IA1)' },
    { id: 13, title: 'Basava Jayanthi', date: '2026-04-20', type: 'holiday', description: 'Basava Jayanthi' },
    { id: 14, title: 'CCA1 Evaluation', date: '2026-04-21', endDate: '2026-04-22', type: 'exam', description: 'Evaluation of CCA1' },
    { id: 15, title: 'IA1 Marks Entry Deadline', date: '2026-04-22', type: 'exam', description: 'Last date to enter IA1 Marks in Contineo Portal' },
    { id: 16, title: 'Dropping of Courses', date: '2026-04-24', endDate: '2026-04-25', type: 'academic', description: 'Last dates for Dropping of the courses' },
    { id: 17, title: 'Parents Teachers Meeting', date: '2026-04-25', type: 'event', description: 'Parents Teachers Meeting' },
    { id: 18, title: 'CCA1 Finalization', date: '2026-04-27', type: 'academic', description: 'Finalization of CCA1' },

    // May 2026
    { id: 19, title: 'May Day', date: '2026-05-01', type: 'holiday', description: 'Labour Day / May Day' },
    { id: 20, title: 'CCA2 Evaluation', date: '2026-05-18', endDate: '2026-05-19', type: 'exam', description: 'Evaluation of CCA2' },
    { id: 21, title: 'CCA2 Finalization', date: '2026-05-25', type: 'academic', description: 'Finalization of CCA2' },
    { id: 22, title: 'IA2 QPs Scrutiny', date: '2026-05-27', type: 'exam', description: 'IA2 Question Papers Scrutiny' },
    { id: 23, title: 'Bakrid', date: '2026-05-28', type: 'holiday', description: 'Eid ul-Adha' },
    { id: 24, title: 'Lab Internals', date: '2026-05-25', endDate: '2026-06-01', type: 'exam', description: 'Conduction of Lab Internals in Regular Lab Slots' },

    // June 2026
    { id: 25, title: 'Internal Assessment 2', date: '2026-06-03', endDate: '2026-06-05', type: 'exam', description: 'Internal Assessment 2 (IA2)' },
    { id: 26, title: 'Withdrawal of Courses', date: '2026-06-09', type: 'academic', description: 'Last date for Withdrawal of the courses' },
    { id: 27, title: 'IA2 Marks Entry Deadline', date: '2026-06-12', type: 'exam', description: 'Last date to enter IA2 Marks in Contineo Portal' },
    { id: 28, title: 'Faculty Feedback-2', date: '2026-06-13', type: 'event', description: 'Faculty Feedback-2 by Students' },
    { id: 29, title: 'CIE Marks Freezing', date: '2026-06-17', type: 'academic', description: 'Freezing of CIE Marks and Attendance in Contineo Portal' },
    { id: 30, title: 'Last Working Day', date: '2026-06-17', type: 'academic', description: 'Last Working Day of IV Semester Classes' },
    { id: 31, title: 'VTU Semester Exams', date: '2026-06-25', endDate: '2026-07-15', type: 'exam', description: 'VTU Semester End Examinations (25-06-2026 ONWARDS)' },
];

// B.E. VI Semester 2025-26 (EVEN) - Jan to May 2026
const sem6Events: CalendarEvent[] = [
    // January 2026
    { id: 1, title: 'PAC Meeting', date: '2026-01-12', endDate: '2026-01-16', type: 'academic', description: 'PAC Meeting to discuss Delivery methods, Assessment methods, Learning Activities and Rubrics' },
    { id: 2, title: 'Course Registration BE VI Sem', date: '2026-01-16', endDate: '2026-01-17', type: 'academic', description: 'Course Registration of BE VI Semester' },
    { id: 3, title: 'VI Semester Classes Begin', date: '2026-01-19', type: 'academic', description: 'Commencement of VI Semester Classes' },
    { id: 4, title: 'Major Project Phase I - Groups', date: '2026-01-23', endDate: '2026-01-27', type: 'academic', description: 'Major Project Phase I: Group Formation and Allotment of Guides' },
    { id: 5, title: 'Republic Day', date: '2026-01-26', type: 'holiday', description: 'National Holiday' },
    { id: 6, title: 'Synopsis Submission', date: '2026-01-31', type: 'academic', description: 'Major Project Phase I: Synopsis Submission' },

    // February 2026
    { id: 7, title: 'Major Project Review 0', date: '2026-02-06', type: 'academic', description: 'Major Project Phase I Review 0: Approval of Synopsis by Review Committee' },
    { id: 8, title: 'CCA Announcement', date: '2026-02-14', type: 'academic', description: 'Announcement of Continuous Comprehensive Assessment (CCA) - CCA1 and CCA2' },
    { id: 9, title: 'Faculty Feedback-1', date: '2026-02-16', type: 'event', description: 'Faculty Feedback-1 by Students' },

    // March 2026
    { id: 10, title: 'Major Project Review I', date: '2026-03-05', endDate: '2026-03-06', type: 'academic', description: 'Major Project Phase I Review I' },
    { id: 11, title: 'IA1 QPs Scrutiny', date: '2026-03-11', type: 'exam', description: 'IA1 Question Papers Scrutiny' },
    { id: 12, title: 'Internal Assessment 1', date: '2026-03-16', endDate: '2026-03-18', type: 'exam', description: 'Internal Assessment 1 (IA1)' },
    { id: 13, title: 'Ugadi', date: '2026-03-19', type: 'holiday', description: 'Kannada New Year' },
    { id: 14, title: 'IA1 Marks Entry Deadline', date: '2026-03-25', type: 'exam', description: 'Last date to enter IA1 Marks in Contineo Portal' },
    { id: 15, title: 'Dropping of Courses', date: '2026-03-27', endDate: '2026-03-28', type: 'academic', description: 'Last dates for Dropping of the courses' },
    { id: 16, title: 'Parents Teachers Meeting', date: '2026-03-28', type: 'event', description: 'Parents Teachers Meeting' },
    { id: 17, title: 'CCA1 Evaluation', date: '2026-03-30', endDate: '2026-04-01', type: 'exam', description: 'Evaluation of CCA1' },
    { id: 18, title: 'Mahaveer Jayanthi', date: '2026-03-31', type: 'holiday', description: 'Mahaveer Jayanthi' },

    // April 2026
    { id: 19, title: 'CCA1 Finalization', date: '2026-04-02', type: 'academic', description: 'Finalization of CCA1' },
    { id: 20, title: 'Good Friday', date: '2026-04-03', type: 'holiday', description: 'Good Friday' },
    { id: 21, title: 'UTSAHA Fest', date: '2026-04-10', endDate: '2026-04-11', type: 'event', description: 'UTSAHA - College Annual Fest' },
    { id: 22, title: 'Ambedkar Jayanthi', date: '2026-04-14', type: 'holiday', description: 'Dr. B.R. Ambedkar Jayanthi' },
    { id: 23, title: 'Basava Jayanthi', date: '2026-04-20', type: 'holiday', description: 'Basava Jayanthi' },
    { id: 24, title: 'CCA2 Evaluation', date: '2026-04-21', endDate: '2026-04-22', type: 'exam', description: 'Evaluation of CCA2' },
    { id: 25, title: 'Major Project Review II', date: '2026-04-24', endDate: '2026-04-25', type: 'academic', description: 'Major Project Phase I Review II' },
    { id: 26, title: 'CCA2 Finalization', date: '2026-04-29', type: 'academic', description: 'Finalization of CCA2' },
    { id: 27, title: 'IA2 QPs Scrutiny', date: '2026-04-30', type: 'exam', description: 'IA2 Question Papers Scrutiny' },

    // May 2026
    { id: 28, title: 'May Day', date: '2026-05-01', type: 'holiday', description: 'Labour Day / May Day' },
    { id: 29, title: 'Internal Assessment 2', date: '2026-05-07', endDate: '2026-05-09', type: 'exam', description: 'Internal Assessment 2 (IA2)' },
    { id: 30, title: 'Withdrawal of Courses', date: '2026-05-14', type: 'academic', description: 'Last date for Withdrawal of the courses' },
    { id: 31, title: 'IA2 Marks Entry Deadline', date: '2026-05-18', type: 'exam', description: 'Last date to enter IA2 Marks in Contineo Portal' },
    { id: 32, title: 'Faculty Feedback-2', date: '2026-05-19', type: 'event', description: 'Faculty Feedback-2 by Students' },
    { id: 33, title: 'CIE Marks Freezing', date: '2026-05-20', type: 'academic', description: 'Freezing of CIE Marks and Attendance in Contineo Portal' },
    { id: 34, title: 'Last Working Day', date: '2026-05-20', type: 'academic', description: 'Last Working Day of VI Semester Classes' },
    { id: 35, title: 'VTU Semester Exams', date: '2026-05-29', endDate: '2026-06-20', type: 'exam', description: 'VTU Semester End Examinations (29-05-2026 ONWARDS)' },
];

// B.E. VIII Semester 2025-26 (EVEN) - Jan to May 2026
const sem8Events: CalendarEvent[] = [
    // December 2025 / January 2026
    { id: 1, title: 'PAC Meeting', date: '2025-12-31', endDate: '2026-01-02', type: 'academic', description: 'PAC Meeting' },
    { id: 2, title: 'Course Registration VIII Sem', date: '2026-01-02', endDate: '2026-01-03', type: 'academic', description: 'Course Registration for VIII Semester' },
    { id: 3, title: 'VIII Semester Classes Begin', date: '2026-01-05', type: 'academic', description: 'Commencement of VIII Semester' },
    { id: 4, title: 'Makara Sankranthi', date: '2026-01-15', type: 'holiday', description: 'Makara Sankranthi' },
    { id: 5, title: 'Republic Day', date: '2026-01-26', type: 'holiday', description: 'National Holiday' },

    // February 2026
    { id: 6, title: 'Internship Review I', date: '2026-02-28', type: 'academic', description: 'Industry / Research Internship Presentation - Review I' },

    // March 2026
    { id: 7, title: 'Ugadi', date: '2026-03-19', type: 'holiday', description: 'Kannada New Year' },
    { id: 8, title: 'Mahavir Jayanthi', date: '2026-03-31', type: 'holiday', description: 'Mahavir Jayanthi' },

    // April 2026
    { id: 9, title: 'Good Friday', date: '2026-04-03', type: 'holiday', description: 'Good Friday' },
    { id: 10, title: 'Ambedkar Jayanthi', date: '2026-04-14', type: 'holiday', description: 'Dr. B.R. Ambedkar Jayanthi' },
    { id: 11, title: 'Basava Jayanthi', date: '2026-04-20', type: 'holiday', description: 'Basava Jayanthi' },
    { id: 12, title: 'Internship Review II', date: '2026-04-25', type: 'academic', description: 'Industry / Research Internship Presentation - Review II' },
    { id: 13, title: 'CIE Marks Freezing', date: '2026-04-30', type: 'academic', description: 'Freezing of CIE Marks and Attendance in Contineo Portal' },
    { id: 14, title: 'Last Working Day', date: '2026-04-30', type: 'academic', description: 'Last Working Day of VIII Semester' },

    // May 2026
    { id: 15, title: 'VTU Semester Exams', date: '2026-05-04', endDate: '2026-05-25', type: 'exam', description: 'VTU Semester End Examinations (04-05-2026 ONWARDS)' },
];

const semesterInfo: Record<Semester, { title: string; period: string; events: CalendarEvent[] }> = {
    '4th': { title: 'B.E. IV Semester', period: 'Feb - Jun 2026', events: sem4Events },
    '6th': { title: 'B.E. VI Semester', period: 'Jan - May 2026', events: sem6Events },
    '8th': { title: 'B.E. VIII Semester', period: 'Jan - May 2026', events: sem8Events },
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const AcademicCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [filter, setFilter] = useState<EventType | 'all'>('all');
    const [selectedSemester, setSelectedSemester] = useState<Semester>('6th');

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get current semester events
    const academicEvents = semesterInfo[selectedSemester].events;

    // Get days in month
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday)
    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigate months
    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get events for a specific date
    const getEventsForDate = (day: number, month: number, year: number): CalendarEvent[] => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return academicEvents.filter(event => {
            if (event.date === dateStr) return true;
            if (event.endDate) {
                const start = new Date(event.date);
                const end = new Date(event.endDate);
                const check = new Date(dateStr);
                return check >= start && check <= end;
            }
            return false;
        }).filter(e => filter === 'all' || e.type === filter);
    };

    // Get color for event type
    const getEventColor = (type: EventType) => {
        switch (type) {
            case 'exam': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'holiday': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'academic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'event': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getEventIcon = (type: EventType) => {
        switch (type) {
            case 'exam': return <BookOpen className="w-4 h-4" />;
            case 'holiday': return <PartyPopper className="w-4 h-4" />;
            case 'academic': return <GraduationCap className="w-4 h-4" />;
            case 'event': return <Calendar className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    // Get upcoming events (next 60 days)
    const getUpcomingEvents = (): CalendarEvent[] => {
        const today = new Date();
        const sixtyDaysLater = new Date();
        sixtyDaysLater.setDate(today.getDate() + 60);

        return academicEvents
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= sixtyDaysLater;
            })
            .filter(e => filter === 'all' || e.type === filter)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 6);
    };

    // Render calendar grid
    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Day headers
        const headers = dayNames.map(day => (
            <div key={day} className="text-center text-[#6b6b6b] text-sm font-medium py-2">
                {day}
            </div>
        ));

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-1"></div>);
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const events = getEventsForDate(day, currentMonth, currentYear);
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`min-h-[80px] p-1 border border-[#252525] rounded-lg ${isToday ? 'bg-[#10b981]/10 border-[#10b981]' : 'hover:bg-[#1a1a1a]'
                        } transition-colors cursor-pointer`}
                    onClick={() => events.length > 0 && setSelectedEvent(events[0])}
                >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#10b981]' : 'text-[#ebebeb]'}`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {events.slice(0, 2).map((event, idx) => (
                            <div
                                key={idx}
                                className={`text-xs px-1 py-0.5 rounded truncate border ${getEventColor(event.type)}`}
                                title={event.title}
                            >
                                {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                            </div>
                        ))}
                        {events.length > 2 && (
                            <div className="text-xs text-[#6b6b6b]">+{events.length - 2} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {headers}
                {days}
            </div>
        );
    };

    const upcomingEvents = getUpcomingEvents();

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Calendar className="w-10 h-10 text-[#10b981]" />
                        <h1 className="text-3xl font-bold text-[#ebebeb]">Academic Calendar</h1>
                    </div>
                    <p className="text-[#9b9b9b]">BMSIT&M Official Academic Calendar 2025-26</p>
                </div>

                {/* Semester Selector */}
                <div className="flex justify-center mb-6">
                    <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-1 flex gap-1">
                        {(['4th', '6th', '8th'] as Semester[]).map((sem) => (
                            <button
                                key={sem}
                                onClick={() => {
                                    setSelectedSemester(sem);
                                    setSelectedEvent(null);
                                }}
                                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${selectedSemester === sem
                                    ? 'bg-[#10b981] text-white'
                                    : 'text-[#9b9b9b] hover:text-[#ebebeb] hover:bg-[#252525]'
                                    }`}
                            >
                                <div className="text-sm">{sem} Sem</div>
                                <div className="text-xs opacity-75">{semesterInfo[sem].period}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {(['all', 'exam', 'holiday', 'academic', 'event'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type
                                ? 'bg-[#10b981] text-white'
                                : 'bg-[#1a1a1a] text-[#9b9b9b] hover:text-[#ebebeb] border border-[#333333]'
                                }`}
                        >
                            {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2 notion-card p-6">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#9b9b9b]" />
                            </button>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-[#ebebeb]">
                                    {months[currentMonth]} {currentYear}
                                </h2>
                                <button
                                    onClick={goToToday}
                                    className="text-sm text-[#10b981] hover:underline"
                                >
                                    Go to Today
                                </button>
                            </div>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-[#9b9b9b]" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        {renderCalendarGrid()}

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[#252525]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-[#9b9b9b]">Exams</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-[#9b9b9b]">Holidays</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-[#9b9b9b]">Academic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-xs text-[#9b9b9b]">Events</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Semester Info */}
                        <div className="notion-card p-6 bg-gradient-to-br from-[#10b981]/10 to-[#1a1a1a]">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-2">
                                {semesterInfo[selectedSemester].title}
                            </h3>
                            <p className="text-[#9b9b9b] text-sm mb-3">{semesterInfo[selectedSemester].period} (EVEN)</p>
                            <div className="text-xs text-[#6b6b6b]">
                                {academicEvents.length} events scheduled
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="notion-card p-6">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-[#10b981]" />
                                Upcoming Events
                            </h3>
                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className={`p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type)}`}
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {getEventIcon(event.type)}
                                                <span className="font-medium text-sm">{event.title}</span>
                                            </div>
                                            <p className="text-xs opacity-75">
                                                {new Date(event.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                                {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#6b6b6b] text-sm">No upcoming events for this semester.</p>
                            )}
                        </div>

                        {/* Selected Event Detail */}
                        {selectedEvent && (
                            <div className="notion-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-[#ebebeb]">Event Details</h3>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="text-[#6b6b6b] hover:text-[#ebebeb]"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className={`p-4 rounded-lg border ${getEventColor(selectedEvent.type)}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getEventIcon(selectedEvent.type)}
                                        <span className="font-semibold">{selectedEvent.title}</span>
                                    </div>
                                    <p className="text-sm opacity-75 mb-2">
                                        📅 {new Date(selectedEvent.date).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                        {selectedEvent.endDate && (
                                            <> to {new Date(selectedEvent.endDate).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            })}</>
                                        )}
                                    </p>
                                    {selectedEvent.description && (
                                        <p className="text-sm opacity-75">{selectedEvent.description}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="notion-card p-6">
                            <h3 className="text-lg font-semibold text-[#ebebeb] mb-4">Semester Overview</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-red-400">
                                        {academicEvents.filter(e => e.type === 'exam').length}
                                    </p>
                                    <p className="text-xs text-red-300">Exams</p>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-green-400">
                                        {academicEvents.filter(e => e.type === 'holiday').length}
                                    </p>
                                    <p className="text-xs text-green-300">Holidays</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-400">
                                        {academicEvents.filter(e => e.type === 'academic').length}
                                    </p>
                                    <p className="text-xs text-blue-300">Academic</p>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-purple-400">
                                        {academicEvents.filter(e => e.type === 'event').length}
                                    </p>
                                    <p className="text-xs text-purple-300">Events</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[#6b6b6b] text-sm mt-8">
                    <p>Academic Calendar is tentative. Please refer to official BMSIT&M notices for confirmed dates.</p>
                    <p className="mt-1">Source: Tentative Calendar of Events (CoE) - BMSIT&M</p>
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;
