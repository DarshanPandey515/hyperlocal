import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../AuthConstants';
import { LayoutDashboard, MessageCircle, Users, User, LogOut } from "lucide-react";


export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [profileData, setProfileData] = useState({
        bio: '',
        skills: [],
        location: '',
        availability: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const navigate = useNavigate();

    // Initialize localStorage data
    useEffect(() => {
        const currentUser = authUtils.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
            navigate('/auth/login');
            return;
        }
        setUser(currentUser);

        // Load messages from localStorage
        const savedMessages = JSON.parse(localStorage.getItem('hyperlocal_messages') || '[]');
        setMessages(savedMessages);

        // Load community posts from localStorage
        const savedPosts = JSON.parse(localStorage.getItem('hyperlocal_community_posts') || '[]');
        if (savedPosts.length === 0) {
            const defaultPosts = [
                {
                    id: Date.now(),
                    author: "Team Hyperlocal",
                    content: "👋 Welcome to the Hyperlocal community! Start by sharing what skill you're learning or teaching today.",
                    timestamp: new Date().toISOString(),
                    likes: 3,
                    comments: [
                        {
                            id: Date.now() + 1,
                            author: "Community Bot",
                            text: "Tip: Use #tags in your post to help others find you easily!",
                            timestamp: new Date().toISOString()
                        }
                    ],
                    authorAvatar: "H"
                },
                {
                    id: Date.now() + 2,
                    author: "Riya Sharma",
                    content: "Just connected with my neighbor to learn basic Photoshop editing — this platform is awesome!",
                    timestamp: new Date().toISOString(),
                    likes: 8,
                    comments: [],
                    authorAvatar: "R"
                }
            ];

            localStorage.setItem('hyperlocal_community_posts', JSON.stringify(defaultPosts));
            setCommunityPosts(defaultPosts);
        } else {
            setCommunityPosts(savedPosts);
        }
        // Load profile data from localStorage
        const savedProfile = JSON.parse(localStorage.getItem('hyperlocal_profile') || '{}');
        setProfileData({
            bio: savedProfile.bio || '',
            skills: savedProfile.skills || [],
            location: savedProfile.location || '',
            availability: savedProfile.availability || ''
        });
    }, [navigate]);

    // Sample conversations for demo
    const conversations = [
        { id: 1, name: 'Sarah M.', lastMessage: 'Looking forward to our guitar session!', unread: true, avatar: 'SM' },
        { id: 2, name: 'Mike T.', lastMessage: 'Thanks for the web development tips!', unread: false, avatar: 'MT' },
        { id: 3, name: 'Lisa Y.', lastMessage: 'Are you available for cooking classes?', unread: true, avatar: 'LY' }
    ];

    // Handle sending a new message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const message = {
            id: Date.now(),
            conversationId: selectedConversation.id,
            sender: user.username,
            text: newMessage,
            timestamp: new Date().toISOString(),
            read: false
        };

        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        localStorage.setItem('hyperlocal_messages', JSON.stringify(updatedMessages));
        setNewMessage('');
    };

    // Handle creating a new community post
    const handleCreatePost = () => {
        if (!newPost.trim()) return;

        const post = {
            id: Date.now(),
            author: user.username,
            content: newPost,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
            authorAvatar: user.username.charAt(0).toUpperCase()
        };

        const updatedPosts = [post, ...communityPosts];
        setCommunityPosts(updatedPosts);
        localStorage.setItem('hyperlocal_community_posts', JSON.stringify(updatedPosts));
        setNewPost('');
    };

    // Handle liking a post
    const handleLikePost = (postId) => {
        const updatedPosts = communityPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        setCommunityPosts(updatedPosts);
        localStorage.setItem('hyperlocal_community_posts', JSON.stringify(updatedPosts));
    };

    // Handle adding a comment to a post
    const handleAddComment = (postId, commentText) => {
        if (!commentText.trim()) return;

        const updatedPosts = communityPosts.map(post => {
            if (post.id === postId) {
                const newComment = {
                    id: Date.now(),
                    author: user.username,
                    text: commentText,
                    timestamp: new Date().toISOString()
                };
                return { ...post, comments: [...post.comments, newComment] };
            }
            return post;
        });

        setCommunityPosts(updatedPosts);
        localStorage.setItem('hyperlocal_community_posts', JSON.stringify(updatedPosts));
    };

    // Handle profile updates
    const handleProfileUpdate = () => {
        localStorage.setItem('hyperlocal_profile', JSON.stringify(profileData));
        alert('Profile updated successfully!');
    };

    // Handle adding a new skill
    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        const updatedSkills = [...profileData.skills, newSkill];
        setProfileData({ ...profileData, skills: updatedSkills });
        setNewSkill('');
    };

    // Handle removing a skill
    const handleRemoveSkill = (skillToRemove) => {
        const updatedSkills = profileData.skills.filter(skill => skill !== skillToRemove);
        setProfileData({ ...profileData, skills: updatedSkills });
    };

    const handleLogout = () => {
        authUtils.logout();
        navigate('/auth/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Hyperlocal</h1>
                    <p className="text-sm text-gray-600 mt-1">Skill Sharing Platform</p>
                </div>

                <nav className="p-4 space-y-2">
                    {[
                        { id: "overview", name: "Overview", icon: LayoutDashboard },
                        { id: "messages", name: "Messages", icon: MessageCircle },
                        { id: "community", name: "Community", icon: Users },
                        { id: "profile", name: "Profile", icon: User },

                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === item.id
                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-lg">
                                <item.icon className='w-4 h-4' />
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="text-lg">
                            <LogOut className='w-4 h-4' />
                        </span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                    {activeTab === 'overview' && 'Dashboard Overview'}
                                    {activeTab === 'messages' && 'Messages'}
                                    {activeTab === 'community' && 'Community'}
                                    {activeTab === 'profile' && 'My Profile'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Welcome back, {user.username}! Ready to learn and share skills?
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-1 -right-1 border-2 border-white"></div>
                                    <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: 'Skills Learning', value: '3', change: '+2 this month' },
                                    { title: 'Skills Teaching', value: '2', change: '+1 this month' },
                                    { title: 'Community Points', value: '150', change: '+25 this week' },
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                                {/* <p className="text-sm text-green-600 mt-1">{stat.change}</p> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-linear-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2">Find Skills to Learn</h3>
                                    <p className="mb-4 opacity-90">Discover new skills in your neighborhood</p>
                                    <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                        Explore Skills
                                    </button>
                                </div>
                                <div className="bg-linear-to-r from-gray-900 to-black rounded-xl p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2">Share Your Skills</h3>
                                    <p className="mb-4 opacity-90">Teach others what you know</p>
                                    <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
                                        Start Teaching
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                                {/* Conversations List */}
                                <div className="border-r border-gray-200">
                                    <div className="p-4 border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                                    </div>
                                    <div className="overflow-y-auto h-full">
                                        {conversations.map((conversation) => (
                                            <div
                                                key={conversation.id}
                                                onClick={() => setSelectedConversation(conversation)}
                                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === conversation.id ? 'bg-yellow-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-linear-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {conversation.avatar}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium text-gray-900 truncate">
                                                                {conversation.name}
                                                            </h3>
                                                            {conversation.unread && (
                                                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {conversation.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div className="md:col-span-2 flex flex-col">
                                    {selectedConversation ? (
                                        <>
                                            {/* Chat Header */}
                                            <div className="p-4 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-linear-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {selectedConversation.avatar}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {selectedConversation.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                {messages
                                                    .filter(msg => msg.conversationId === selectedConversation.id)
                                                    .map((message) => (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${message.sender === user.username ? 'justify-end' : 'justify-start'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === user.username
                                                                    ? 'bg-yellow-400 text-black'
                                                                    : 'bg-gray-200 text-gray-900'
                                                                    }`}
                                                            >
                                                                <p>{message.text}</p>
                                                                <p className="text-xs opacity-70 mt-1">
                                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>

                                            {/* Message Input */}
                                            <div className="p-4 border-t border-gray-200">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder="Type a message..."
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-gray-500">
                                            Select a conversation to start messaging
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Community Tab */}
                    {activeTab === 'community' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Create Post */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            placeholder="Share what you're learning or teaching..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                                            rows="3"
                                        />
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex gap-2 text-gray-500">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">📷</button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">🎯</button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">📍</button>
                                            </div>
                                            <button
                                                onClick={handleCreatePost}
                                                disabled={!newPost.trim()}
                                                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Community Posts */}
                            <div className="space-y-4">
                                {communityPosts.map((post) => (
                                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        {/* Post Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-linear-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {post.authorAvatar}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(post.timestamp).toLocaleDateString()} at{' '}
                                                    {new Date(post.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                                        {/* Post Actions */}
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleLikePost(post.id)}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors"
                                                >
                                                    ❤️ {post.likes} likes
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors">
                                                    💬 {post.comments.length} comments
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comments Section */}
                                        {post.comments.length > 0 && (
                                            <div className="mt-4 space-y-3">
                                                {post.comments.map((comment) => (
                                                    <div key={comment.id} className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                                                            {comment.author.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                                                                <p className="font-medium text-sm text-gray-900">
                                                                    {comment.author}
                                                                </p>
                                                                <p className="text-gray-700 text-sm">{comment.text}</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(comment.timestamp).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Comment */}
                                        <div className="mt-4 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddComment(post.id, e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {communityPosts.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No posts yet. Be the first to share in the community!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Profile Info */}
                                    <div className="lg:col-span-1">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
                                            <p className="text-gray-600">Member since {new Date(user.loginTime).toLocaleDateString()}</p>
                                        </div>

                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    value={profileData.location}
                                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                    placeholder="Your city or neighborhood"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                                <input
                                                    type="text"
                                                    value={profileData.availability}
                                                    onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                                                    placeholder="e.g., Weekends, Evenings"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio and Skills */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                placeholder="Tell the community about yourself and what you love to learn/teach..."
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    placeholder="Add a skill (e.g., Guitar, Cooking, Web Dev)"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                                />
                                                <button
                                                    onClick={handleAddSkill}
                                                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.skills.map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                                    >
                                                        {skill}
                                                        <button
                                                            onClick={() => handleRemoveSkill(skill)}
                                                            className="text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={handleProfileUpdate}
                                                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                                            >
                                                Save Profile
                                            </button>
                                            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                                View Public Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}