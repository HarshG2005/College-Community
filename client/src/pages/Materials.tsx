import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import {
    BookOpen, Search, Download, ThumbsUp, ThumbsDown,
    FileText, Plus, X, Link as LinkIcon, ExternalLink
} from 'lucide-react';

interface Material {
    _id: string;
    title: string;
    subject: string;
    description: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: { name: string };
    upvotes: string[];
    downvotes: string[];
    downloads: number;
    createdAt: string;
}

const subjects = ['All', 'Data Structures', 'Operating Systems', 'Database Management', 'Computer Networks', 'Web Development', 'Machine Learning', 'Mathematics', 'VLSI Design'];
const fileTypes = ['PDF', 'DOC', 'PPT', 'ZIP', 'OTHER'];

export default function Materials() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: 'Data Structures',
        fileUrl: '',
        fileType: 'PDF'
    });

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const res = await api.get('/materials');
            setMaterials(res.data.materials || []);
        } catch (error) {
            console.error('Failed to fetch materials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleVote = async (id: string, type: 'up' | 'down') => {
        try {
            const res = await api.put(`/materials/${id}/vote`, { voteType: type });
            setMaterials(materials.map(m => {
                if (m._id === id) {
                    return {
                        ...m,
                        upvotes: type === 'up' ? [...m.upvotes, 'me'] : m.upvotes, // Optimistic update simulation
                        downvotes: type === 'down' ? [...m.downvotes, 'me'] : m.downvotes
                    };
                }
                return m;
            }));
            fetchMaterials(); // Refresh for accurate count
        } catch (error) {
            console.error('Vote failed');
        }
    };

    const handleDownload = async (id: string, url: string) => {
        try {
            await api.put(`/materials/${id}/download`);
            window.open(url, '_blank');
            setMaterials(materials.map(m =>
                m._id === id ? { ...m, downloads: m.downloads + 1 } : m
            ));
        } catch (error) {
            console.error('Download tracking failed');
            window.open(url, '_blank'); // Open anyway
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/materials', formData);
            setShowUploadModal(false);
            setFormData({
                title: '',
                description: '',
                subject: 'Data Structures',
                fileUrl: '',
                fileType: 'PDF'
            });
            fetchMaterials();
        } catch (error) {
            console.error('Upload failed');
            alert('Failed to share material. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredMaterials = materials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || material.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#ebebeb] mb-1">Study Materials</h1>
                    <p className="text-[#6b6b6b]">Notes, PDFs, and question papers shared by students</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Share Material</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {subjects.map((subject) => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${selectedSubject === subject
                                ? 'bg-[#2f2f2f] text-[#ebebeb]'
                                : 'text-[#6b6b6b] hover:bg-[#252525]'
                                }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Materials List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="w-10 h-10 text-[#333333] mx-auto mb-3" />
                    <p className="text-[#6b6b6b]">No materials found</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredMaterials.map((material) => (
                        <div key={material._id} className="notion-card p-4 hover:bg-[#252525] group transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#252525] rounded flex items-center justify-center flex-shrink-0 group-hover:bg-[#333333] transition-colors">
                                    <FileText className="w-5 h-5 text-[#6b6b6b] group-hover:text-[#10b981] transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-[#ebebeb] mb-1 truncate">{material.title}</h3>
                                    <p className="text-xs text-[#6b6b6b] mb-2 line-clamp-1">{material.description}</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
                                        <span className="badge-gray">{material.subject}</span>
                                        <span className="text-[#404040]">|</span>
                                        <span>Shared by {material.uploadedBy?.name || 'Unknown'}</span>
                                        <span className="text-[#404040]">|</span>
                                        <button
                                            onClick={() => handleVote(material._id, 'up')}
                                            className="flex items-center gap-1 hover:text-green-500 transition-colors"
                                        >
                                            <ThumbsUp className="w-3 h-3" />
                                            {material.upvotes?.length || 0}
                                        </button>
                                        <button
                                            onClick={() => handleVote(material._id, 'down')}
                                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                        >
                                            <ThumbsDown className="w-3 h-3" />
                                            {material.downvotes?.length || 0}
                                        </button>
                                        <span className="flex items-center gap-1 ml-2">
                                            <Download className="w-3 h-3" />
                                            {material.downloads || 0}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(material._id, material.fileUrl)}
                                    className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-2 group-hover:border-[#404040] transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Access
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#191919] border border-[#333333] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-[#333333] flex items-center justify-between bg-[#202020]">
                            <h3 className="text-lg font-semibold text-[#ebebeb]">Share Material</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-[#6b6b6b] hover:text-[#ebebeb] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase mb-1.5">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., DSA Unit 1 Notes"
                                    className="input-field w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase mb-1.5">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input-field w-full"
                                >
                                    {subjects.filter(s => s !== 'All').map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#6b6b6b] uppercase mb-1.5">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the material..."
                                    className="input-field w-full min-h-[80px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#6b6b6b] uppercase mb-1.5">Link URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                                        <input
                                            type="url"
                                            required
                                            value={formData.fileUrl}
                                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            placeholder="https://drive.google.com..."
                                            className="input-field w-full pl-9"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#6b6b6b] uppercase mb-1.5">Type</label>
                                    <select
                                        value={formData.fileType}
                                        onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                                        className="input-field w-full"
                                    >
                                        {fileTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-full justify-center mt-2"
                            >
                                {submitting ? 'Sharing...' : 'Share Material'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
