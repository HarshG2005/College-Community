import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, Calendar, Code, Save, Camera, Plus, X, Loader2 } from 'lucide-react';

const skillSuggestions = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
    'MongoDB', 'SQL', 'Machine Learning', 'Data Structures',
    'Algorithms', 'System Design', 'Docker', 'AWS', 'Git'
];

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        branch: user?.branch || '',
        year: user?.year || 1,
        skills: user?.skills || [],
    });
    const [newSkill, setNewSkill] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (skill: string) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
        }
        setNewSkill('');
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#ebebeb] mb-1">Profile</h1>
                <p className="text-[#6b6b6b]">Manage your profile and skills</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="notion-card p-6 text-center">
                        {/* Avatar */}
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-[#10b981] rounded-full flex items-center justify-center mx-auto">
                                <span className="text-3xl font-semibold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-[#2f2f2f] border border-[#333333] rounded-full text-[#9b9b9b] hover:text-[#ebebeb] transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <h2 className="text-lg font-semibold text-[#ebebeb] mb-1">{user?.name}</h2>
                        <p className="text-sm text-[#9b9b9b] mb-4">{user?.email}</p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="badge-gray">{user?.branch || 'Branch'}</span>
                            <span className="badge-gray">Year {user?.year || '?'}</span>
                        </div>

                        <div className="text-left pt-4 border-t border-[#333333] space-y-3">
                            <div className="flex items-center gap-3 text-[#9b9b9b]">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#9b9b9b]">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-sm">{user?.branch || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#9b9b9b]">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Year {user?.year || '?'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="notion-card p-6 mt-6">
                        <h3 className="text-base font-medium text-[#ebebeb] mb-4">Your Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#9b9b9b]">Notes Uploaded</span>
                                <span className="font-medium text-[#ebebeb]">12</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#9b9b9b]">Events Attended</span>
                                <span className="font-medium text-[#ebebeb]">8</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#9b9b9b]">Upvotes Received</span>
                                <span className="font-medium text-[#ebebeb]">156</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#9b9b9b]">Member Since</span>
                                <span className="font-medium text-[#ebebeb]">Jan 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <div className="notion-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-[#ebebeb]">Profile Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-secondary text-sm"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-[#9b9b9b] mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="input-field pl-10 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-1.5">
                                        Branch
                                    </label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                                        <select
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input-field pl-10 disabled:opacity-50"
                                        >
                                            <option value="">Select Branch</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9b9b9b] mb-1.5">
                                        Year
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input-field pl-10 disabled:opacity-50"
                                        >
                                            <option value={1}>1st Year</option>
                                            <option value={2}>2nd Year</option>
                                            <option value={3}>3rd Year</option>
                                            <option value={4}>4th Year</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm text-[#9b9b9b] mb-2">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        Skills
                                    </div>
                                </label>

                                {/* Current Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="badge-blue flex items-center gap-2"
                                        >
                                            {skill}
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:text-red-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                    {formData.skills.length === 0 && (
                                        <span className="text-[#6b6b6b] text-sm">No skills added yet</span>
                                    )}
                                </div>

                                {/* Add Skill */}
                                {isEditing && (
                                    <>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Add a skill"
                                                className="input-field flex-1"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddSkill(newSkill);
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddSkill(newSkill)}
                                                className="btn-secondary px-3"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Suggestions */}
                                        <div className="flex flex-wrap gap-2">
                                            {skillSuggestions
                                                .filter(s => !formData.skills.includes(s))
                                                .slice(0, 8)
                                                .map((skill, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleAddSkill(skill)}
                                                        className="px-3 py-1 text-xs bg-[#2f2f2f] text-[#9b9b9b] rounded-full hover:bg-[#333333] hover:text-[#ebebeb] transition-colors"
                                                    >
                                                        + {skill}
                                                    </button>
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
