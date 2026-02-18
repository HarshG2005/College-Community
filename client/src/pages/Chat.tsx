import { useState, useRef, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Send, Hash, Users, Search, User, Smile, Paperclip, MoreVertical, Loader2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
    _id: string;
    sender: { _id: string; name: string };
    content: string;
    room: string;
    createdAt: string;
    type?: string;
}

interface Channel {
    _id: string;
    name: string;
    type: 'group' | 'direct';
    lastMessage?: string;
    unread: number;
    members?: number;
}

// Predefined public channels (App Configuration)
const DEFAULT_CHANNELS: Channel[] = [
    { _id: 'general', name: 'general', type: 'group', unread: 0, members: 0 },
    { _id: 'announcements', name: 'announcements', type: 'group', unread: 0, members: 0 },
    { _id: 'doubts', name: 'doubts', type: 'group', unread: 0, members: 0 },
    { _id: 'events', name: 'events', type: 'group', unread: 0, members: 0 },
    { _id: 'placement', name: 'placement', type: 'group', unread: 0, members: 0 },
];

export default function Chat() {
    const { user, token } = useAuth();
    const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel>(DEFAULT_CHANNELS[0]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Socket Connection
    useEffect(() => {
        // Connect to socket server
        socketRef.current = io('/', {
            path: '/socket.io',
            // If we needed auth: auth: { token }
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
        });

        socketRef.current.on('receive_message', (message: Message) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.find(m => m._id === message._id)) return prev;
                // Only add if it belongs to current room
                if (message.room === selectedChannel._id) {
                    return [...prev, message];
                }
                return prev;
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []); // Run once on mount

    // Join Room when selectedChannel changes
    useEffect(() => {
        if (!selectedChannel._id || !socketRef.current) return;

        // Join the new room
        socketRef.current.emit('join_room', selectedChannel._id);

        // Fetch messages for the room
        fetchMessages(selectedChannel._id);
    }, [selectedChannel._id]);

    const fetchMessages = async (roomId: string) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/messages/${roomId}`);
            setMessages(res.data.messages);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setIsSending(true);
        try {
            // 1. Send to API to save to DB
            const res = await api.post('/messages', {
                content: newMessage,
                room: selectedChannel._id,
                type: 'text'
            });

            const savedMessage = res.data.message;

            // 2. Emit to Socket for real-time updates to others
            // Note: backend might simply broadcast what we send, or we might need to send the *saved* message object
            socketRef.current?.emit('send_message', savedMessage);

            // 3. Update local UI immediately (optimistic)
            setMessages((prev) => [...prev, savedMessage]);
            setNewMessage('');

        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const filteredChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupChannels = filteredChannels.filter(c => c.type === 'group');
    const directChannels = filteredChannels.filter(c => c.type === 'direct');

    return (
        <div className="h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] flex bg-[#191919] overflow-hidden">
            {/* Sidebar */}
            <div className={`${showSidebar ? 'w-64' : 'hidden'} lg:block lg:w-64 bg-[#202020] border-r border-[#333333] flex flex-col`}>
                {/* Search */}
                <div className="p-3 border-b border-[#333333]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b6b6b]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find channels..."
                            className="w-full pl-9 pr-3 py-1.5 bg-[#2f2f2f] border border-[#333333] rounded text-sm text-[#ebebeb] placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#404040]"
                        />
                    </div>
                </div>

                {/* Channels List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-4 font-medium">
                    {/* Group Channels */}
                    <div>
                        <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#6b6b6b] font-medium uppercase tracking-wide">
                            <Hash className="w-3 h-3" />
                            Channels
                        </div>
                        <div className="space-y-0.5 mt-1">
                            {groupChannels.map(channel => (
                                <button
                                    key={channel._id}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-colors group ${selectedChannel._id === channel._id
                                        ? 'bg-[#2f2f2f] text-[#ebebeb]'
                                        : 'text-[#9b9b9b] hover:bg-[#252525] hover:text-[#ebebeb]'
                                        }`}
                                >
                                    <Hash className="w-3.5 h-3.5 flex-shrink-0 text-[#6b6b6b] group-hover:text-[#9b9b9b]" />
                                    <span className="flex-1 text-left truncate text-sm">{channel.name}</span>
                                    {channel.unread > 0 && (
                                        <span className="px-1.5 py-0.5 bg-[#e11d48] text-white text-[10px] font-bold rounded-sm">
                                            {channel.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Direct Messages (Placeholder/Future) */}
                    <div>
                        <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#6b6b6b] font-medium uppercase tracking-wide">
                            <Users className="w-3 h-3" />
                            Direct Messages
                        </div>
                        <div className="px-3 py-2 text-xs text-[#6b6b6b] italic">
                            No direct messages yet
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#191919]">
                {/* Header */}
                <div className="px-4 py-3 border-b border-[#333333] flex items-center justify-between bg-[#191919]">
                    <div className="flex items-center gap-2">
                        {selectedChannel.type === 'group' ? (
                            <Hash className="w-5 h-5 text-[#9b9b9b]" />
                        ) : (
                            <div className="w-6 h-6 bg-[#252525] rounded-sm flex items-center justify-center">
                                <User className="w-4 h-4 text-[#6b6b6b]" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-sm font-semibold text-[#ebebeb]">{selectedChannel.name}</h2>
                            <p className="text-xs text-[#6b6b6b]">
                                {isLoading ? 'Loading messages...' : 'Welcome to the channel'}
                            </p>
                        </div>
                    </div>
                    <button className="p-1.5 text-[#6b6b6b] hover:text-[#ebebeb] rounded hover:bg-[#252525]">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#6b6b6b]">
                            <Hash className="w-12 h-12 mb-2 opacity-20" />
                            <p className="text-sm">No messages yet. Be the first to say hi!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwn = message.sender._id === user?._id;
                            const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={message._id || Math.random().toString()} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 bg-[#252525] rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#9b9b9b] text-xs font-semibold">
                                            {message.sender.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-xs font-medium text-[#ebebeb]">{message.sender.name || 'Unknown'}</span>
                                            <span className="text-[10px] text-[#6b6b6b]">{time}</span>
                                        </div>
                                        <div className={`px-3 py-2 rounded-lg text-sm break-words ${isOwn
                                            ? 'bg-[#10b981] text-white'
                                            : 'bg-[#252525] text-[#ebebeb] border border-[#333333]'
                                            }`}>
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {isLoading && (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin text-[#10b981]" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#333333] bg-[#191919]">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[#202020] border border-[#333333] rounded-lg p-1.5 focus-within:border-[#404040] transition-colors">
                        <button type="button" className="p-1.5 text-[#6b6b6b] hover:text-[#ebebeb] rounded hover:bg-[#252525]">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${selectedChannel.name}`}
                            className="flex-1 bg-transparent border-none text-sm text-[#ebebeb] placeholder:text-[#6b6b6b] focus:outline-none focus:ring-0 px-2"
                            disabled={isSending}
                        />
                        <button type="button" className="p-1.5 text-[#6b6b6b] hover:text-[#ebebeb] rounded hover:bg-[#252525]">
                            <Smile className="w-4 h-4" />
                        </button>
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || isSending}
                            className={`p-1.5 rounded transition-colors flex items-center justify-center ${newMessage.trim() && !isSending
                                    ? 'bg-[#10b981] text-white hover:bg-[#1a6fc7]'
                                    : 'bg-[#2f2f2f] text-[#6b6b6b] cursor-not-allowed'
                                }`}
                        >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
