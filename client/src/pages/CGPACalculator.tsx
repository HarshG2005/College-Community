import { useState } from 'react';
import { Calculator, Plus, Trash2, RotateCcw, GraduationCap, BookOpen, Info } from 'lucide-react';

// VTU Grading System (2022 Scheme)
const gradePoints: { [key: string]: number } = {
    'O': 10,   // Outstanding (90-100)
    'A+': 9,   // Excellent (80-89)
    'A': 8,    // Very Good (70-79)
    'B+': 7,   // Good (60-69)
    'B': 6,    // Above Average (55-59)
    'C': 5,    // Average (50-54)
    'P': 4,    // Pass (40-49)
    'F': 0,    // Fail (<40)
    'Ab': 0,   // Absent
};

const gradeInfo = [
    { grade: 'O', range: '90-100', points: 10, desc: 'Outstanding' },
    { grade: 'A+', range: '80-89', points: 9, desc: 'Excellent' },
    { grade: 'A', range: '70-79', points: 8, desc: 'Very Good' },
    { grade: 'B+', range: '60-69', points: 7, desc: 'Good' },
    { grade: 'B', range: '55-59', points: 6, desc: 'Above Average' },
    { grade: 'C', range: '50-54', points: 5, desc: 'Average' },
    { grade: 'P', range: '40-49', points: 4, desc: 'Pass' },
    { grade: 'F', range: '<40', points: 0, desc: 'Fail' },
];

interface Subject {
    id: number;
    name: string;
    credits: number;
    grade: string;
}

interface Semester {
    id: number;
    name: string;
    subjects: Subject[];
    sgpa: number;
    totalCredits: number;
}

const CGPACalculator = () => {
    const [mode, setMode] = useState<'sgpa' | 'cgpa'>('sgpa');
    const [showGradeInfo, setShowGradeInfo] = useState(false);

    // SGPA Calculator State
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, name: 'Subject 1', credits: 4, grade: 'O' },
        { id: 2, name: 'Subject 2', credits: 4, grade: 'A+' },
        { id: 3, name: 'Subject 3', credits: 3, grade: 'A' },
    ]);

    // CGPA Calculator State
    const [semesters, setSemesters] = useState<Semester[]>([
        { id: 1, name: 'Semester 1', subjects: [], sgpa: 0, totalCredits: 20 },
        { id: 2, name: 'Semester 2', subjects: [], sgpa: 0, totalCredits: 20 },
    ]);

    // SGPA Functions
    const addSubject = () => {
        const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
        setSubjects([...subjects, { id: newId, name: `Subject ${newId}`, credits: 3, grade: 'O' }]);
    };

    const removeSubject = (id: number) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter(s => s.id !== id));
        }
    };

    const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
        setSubjects(subjects.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const calculateSGPA = (): { sgpa: number; totalCredits: number; earnedCredits: number } => {
        let totalCredits = 0;
        let totalPoints = 0;
        let earnedCredits = 0;

        subjects.forEach(subject => {
            const points = gradePoints[subject.grade] || 0;
            totalCredits += subject.credits;
            totalPoints += subject.credits * points;
            if (points > 0) earnedCredits += subject.credits;
        });

        const sgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        return { sgpa: parseFloat(sgpa.toFixed(2)), totalCredits, earnedCredits };
    };

    const resetSGPA = () => {
        setSubjects([
            { id: 1, name: 'Subject 1', credits: 4, grade: 'O' },
            { id: 2, name: 'Subject 2', credits: 4, grade: 'A+' },
            { id: 3, name: 'Subject 3', credits: 3, grade: 'A' },
        ]);
    };

    // CGPA Functions
    const addSemester = () => {
        const newId = semesters.length + 1;
        setSemesters([...semesters, { id: newId, name: `Semester ${newId}`, subjects: [], sgpa: 0, totalCredits: 20 }]);
    };

    const removeSemester = (id: number) => {
        if (semesters.length > 1) {
            setSemesters(semesters.filter(s => s.id !== id));
        }
    };

    const updateSemester = (id: number, field: 'sgpa' | 'totalCredits', value: number) => {
        setSemesters(semesters.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const calculateCGPA = (): { cgpa: number; totalCredits: number } => {
        let totalCredits = 0;
        let totalPoints = 0;

        semesters.forEach(sem => {
            if (sem.sgpa > 0 && sem.totalCredits > 0) {
                totalCredits += sem.totalCredits;
                totalPoints += sem.sgpa * sem.totalCredits;
            }
        });

        const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        return { cgpa: parseFloat(cgpa.toFixed(2)), totalCredits };
    };

    const resetCGPA = () => {
        setSemesters([
            { id: 1, name: 'Semester 1', subjects: [], sgpa: 0, totalCredits: 20 },
            { id: 2, name: 'Semester 2', subjects: [], sgpa: 0, totalCredits: 20 },
        ]);
    };

    const sgpaResult = calculateSGPA();
    const cgpaResult = calculateCGPA();

    // Get grade color
    const getGradeColor = (grade: string) => {
        const points = gradePoints[grade];
        if (points >= 9) return 'text-green-400';
        if (points >= 7) return 'text-blue-400';
        if (points >= 5) return 'text-yellow-400';
        if (points >= 4) return 'text-orange-400';
        return 'text-red-400';
    };

    // Get SGPA/CGPA color
    const getScoreColor = (score: number) => {
        if (score >= 9) return 'text-green-400';
        if (score >= 8) return 'text-emerald-400';
        if (score >= 7) return 'text-blue-400';
        if (score >= 6) return 'text-yellow-400';
        if (score >= 5) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Calculator className="w-10 h-10 text-[#10b981]" />
                        <h1 className="text-3xl font-bold text-[#ebebeb]">VTU Grade Calculator</h1>
                    </div>
                    <p className="text-[#9b9b9b]">Calculate your SGPA and CGPA using VTU 2022 Scheme</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-1 flex gap-1">
                        <button
                            onClick={() => setMode('sgpa')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${mode === 'sgpa'
                                    ? 'bg-[#10b981] text-white'
                                    : 'text-[#9b9b9b] hover:text-[#ebebeb]'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            SGPA
                        </button>
                        <button
                            onClick={() => setMode('cgpa')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${mode === 'cgpa'
                                    ? 'bg-[#10b981] text-white'
                                    : 'text-[#9b9b9b] hover:text-[#ebebeb]'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4 inline mr-2" />
                            CGPA
                        </button>
                    </div>
                </div>

                {/* Grade Info Toggle */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowGradeInfo(!showGradeInfo)}
                        className="flex items-center gap-2 text-[#10b981] hover:text-[#4a9eff] transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        {showGradeInfo ? 'Hide' : 'Show'} VTU Grading Scale
                    </button>

                    {showGradeInfo && (
                        <div className="mt-4 notion-card p-4 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#333333]">
                                        <th className="py-2 text-left text-[#9b9b9b]">Grade</th>
                                        <th className="py-2 text-left text-[#9b9b9b]">Marks Range</th>
                                        <th className="py-2 text-left text-[#9b9b9b]">Grade Points</th>
                                        <th className="py-2 text-left text-[#9b9b9b]">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gradeInfo.map((g) => (
                                        <tr key={g.grade} className="border-b border-[#252525]">
                                            <td className={`py-2 font-semibold ${getGradeColor(g.grade)}`}>{g.grade}</td>
                                            <td className="py-2 text-[#ebebeb]">{g.range}</td>
                                            <td className="py-2 text-[#ebebeb]">{g.points}</td>
                                            <td className="py-2 text-[#9b9b9b]">{g.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* SGPA Calculator */}
                {mode === 'sgpa' && (
                    <div className="space-y-6">
                        <div className="notion-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#ebebeb]">Enter Subject Details</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetSGPA}
                                        className="flex items-center gap-2 px-3 py-2 text-[#9b9b9b] hover:text-[#ebebeb] transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </button>
                                    <button
                                        onClick={addSubject}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#1a6bc2] text-white rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Subject
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-3 text-sm text-[#9b9b9b] px-2">
                                    <div className="col-span-5">Subject Name</div>
                                    <div className="col-span-2 text-center">Credits</div>
                                    <div className="col-span-3 text-center">Grade</div>
                                    <div className="col-span-2 text-center">Points</div>
                                </div>

                                {/* Subject Rows */}
                                {subjects.map((subject) => (
                                    <div key={subject.id} className="grid grid-cols-12 gap-3 items-center bg-[#1a1a1a] rounded-lg p-3">
                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                value={subject.name}
                                                onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                                                className="w-full bg-[#252525] border border-[#333333] rounded-md px-3 py-2 text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max="6"
                                                value={subject.credits}
                                                onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 1)}
                                                className="w-full bg-[#252525] border border-[#333333] rounded-md px-3 py-2 text-center text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <select
                                                value={subject.grade}
                                                onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                                                className={`w-full bg-[#252525] border border-[#333333] rounded-md px-3 py-2 text-center focus:border-[#10b981] focus:outline-none ${getGradeColor(subject.grade)}`}
                                            >
                                                {Object.keys(gradePoints).map((grade) => (
                                                    <option key={grade} value={grade}>{grade}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className={`font-semibold ${getGradeColor(subject.grade)}`}>
                                                {gradePoints[subject.grade]}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <button
                                                onClick={() => removeSubject(subject.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
                                                disabled={subjects.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SGPA Result */}
                        <div className="notion-card p-6 bg-gradient-to-br from-[#1a1a1a] to-[#202020]">
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-[#9b9b9b] text-sm mb-1">Total Credits</p>
                                    <p className="text-3xl font-bold text-[#ebebeb]">{sgpaResult.totalCredits}</p>
                                </div>
                                <div>
                                    <p className="text-[#9b9b9b] text-sm mb-1">Your SGPA</p>
                                    <p className={`text-5xl font-bold ${getScoreColor(sgpaResult.sgpa)}`}>
                                        {sgpaResult.sgpa}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#9b9b9b] text-sm mb-1">Earned Credits</p>
                                    <p className="text-3xl font-bold text-[#ebebeb]">{sgpaResult.earnedCredits}</p>
                                </div>
                            </div>
                            <p className="text-center text-[#6b6b6b] text-xs mt-4">
                                Formula: SGPA = Σ(Credit × Grade Point) / Σ(Credit)
                            </p>
                        </div>
                    </div>
                )}

                {/* CGPA Calculator */}
                {mode === 'cgpa' && (
                    <div className="space-y-6">
                        <div className="notion-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#ebebeb]">Enter Semester SGPAs</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetCGPA}
                                        className="flex items-center gap-2 px-3 py-2 text-[#9b9b9b] hover:text-[#ebebeb] transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </button>
                                    <button
                                        onClick={addSemester}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#1a6bc2] text-white rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Semester
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-3 text-sm text-[#9b9b9b] px-2">
                                    <div className="col-span-4">Semester</div>
                                    <div className="col-span-3 text-center">SGPA</div>
                                    <div className="col-span-3 text-center">Credits</div>
                                    <div className="col-span-2 text-center">Action</div>
                                </div>

                                {/* Semester Rows */}
                                {semesters.map((sem) => (
                                    <div key={sem.id} className="grid grid-cols-12 gap-3 items-center bg-[#1a1a1a] rounded-lg p-3">
                                        <div className="col-span-4">
                                            <span className="text-[#ebebeb] font-medium">{sem.name}</span>
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.01"
                                                value={sem.sgpa || ''}
                                                onChange={(e) => updateSemester(sem.id, 'sgpa', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                className="w-full bg-[#252525] border border-[#333333] rounded-md px-3 py-2 text-center text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                min="1"
                                                max="30"
                                                value={sem.totalCredits}
                                                onChange={(e) => updateSemester(sem.id, 'totalCredits', parseInt(e.target.value) || 20)}
                                                className="w-full bg-[#252525] border border-[#333333] rounded-md px-3 py-2 text-center text-[#ebebeb] focus:border-[#10b981] focus:outline-none"
                                            />
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <button
                                                onClick={() => removeSemester(sem.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
                                                disabled={semesters.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CGPA Result */}
                        <div className="notion-card p-6 bg-gradient-to-br from-[#1a1a1a] to-[#202020]">
                            <div className="grid md:grid-cols-2 gap-6 text-center">
                                <div>
                                    <p className="text-[#9b9b9b] text-sm mb-1">Total Credits</p>
                                    <p className="text-3xl font-bold text-[#ebebeb]">{cgpaResult.totalCredits}</p>
                                </div>
                                <div>
                                    <p className="text-[#9b9b9b] text-sm mb-1">Your CGPA</p>
                                    <p className={`text-5xl font-bold ${getScoreColor(cgpaResult.cgpa)}`}>
                                        {cgpaResult.cgpa}
                                    </p>
                                </div>
                            </div>
                            <p className="text-center text-[#6b6b6b] text-xs mt-4">
                                Formula: CGPA = Σ(SGPA × Semester Credits) / Σ(Semester Credits)
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer Note */}
                <div className="mt-8 text-center text-[#6b6b6b] text-sm">
                    <p>Based on VTU 2022 Scheme grading system. Results are calculated locally.</p>
                </div>
            </div>
        </div>
    );
};

export default CGPACalculator;
