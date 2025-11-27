// pages/Dashboard.jsx (updated)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, Users, User, LogOut, Search, Bell, Settings, ChevronDown } from "lucide-react";
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import UsersList from '../components/UsersList';
import ConnectionRequests from '../components/ConnectionRequests';
import Messaging from '../components/Messaging';
import ProfileSetup from '../components/ProfileSetup';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [profileData, setProfileData] = useState({
        bio: '',
        skills: [],
        location: '',
        availability: ''
    });
    const [dashboardStats, setDashboardStats] = useState({
        connections: 0,
        messages: 0,
        pendingRequests: 0
    });
    const [newSkill, setNewSkill] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth/login');
            return;
        }

        if (user) {
            const savedProfile = JSON.parse(localStorage.getItem('hyperlocal_profile') || '{}');
            setProfileData({
                bio: savedProfile.bio || '',
                skills: savedProfile.skills || [],
                location: savedProfile.location || '',
                availability: savedProfile.availability || ''
            });
            fetchDashboardStats();
        }
    }, [user, loading, navigate]);

    const fetchDashboardStats = async () => {
        if (!user) return;

        try {
            // Fetch connections count
            const connectionsRef = collection(db, 'connections');
            const acceptedConnectionsQuery = query(
                connectionsRef,
                where('status', '==', 'accepted'),
                where('from', '==', user.uid)
            );
            const acceptedConnectionsSnapshot = await getDocs(acceptedConnectionsQuery);
            const acceptedConnectionsCount = acceptedConnectionsSnapshot.size;

            // Also count connections where current user is the receiver
            const receivedConnectionsQuery = query(
                connectionsRef,
                where('status', '==', 'accepted'),
                where('to', '==', user.uid)
            );
            const receivedConnectionsSnapshot = await getDocs(receivedConnectionsQuery);
            const receivedConnectionsCount = receivedConnectionsSnapshot.size;

            const totalConnections = acceptedConnectionsCount + receivedConnectionsCount;

            // Fetch pending requests count
            const pendingRequestsQuery = query(
                connectionsRef,
                where('status', '==', 'pending'),
                where('to', '==', user.uid)
            );
            const pendingRequestsSnapshot = await getDocs(pendingRequestsQuery);
            const pendingRequestsCount = pendingRequestsSnapshot.size;

            // Fetch messages count (count unique chats)
            const chatsRef = collection(db, 'chats');
            const chatsQuery = query(
                chatsRef,
                where('participants', 'array-contains', user.uid)
            );
            const chatsSnapshot = await getDocs(chatsQuery);
            const messagesCount = chatsSnapshot.size;

            setDashboardStats({
                connections: totalConnections,
                messages: messagesCount,
                pendingRequests: pendingRequestsCount
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileUpdate = () => {
        localStorage.setItem('hyperlocal_profile', JSON.stringify(profileData));
        alert('Profile updated successfully!');
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        const updatedSkills = [...profileData.skills, newSkill];
        setProfileData({ ...profileData, skills: updatedSkills });
        setNewSkill('');
    };

    const handleRemoveSkill = (skillToRemove) => {
        const updatedSkills = profileData.skills.filter(skill => skill !== skillToRemove);
        setProfileData({ ...profileData, skills: updatedSkills });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">
                        <Link to="/">Hyperlocal</Link>
                    </h1>
                    {/* <p className="text-sm text-gray-600 mt-1">Skill Sharing Platform</p> */}
                </div>

                <nav className="p-4 space-y-1">
                    {[
                        { id: "overview", name: "Overview", icon: LayoutDashboard },
                        { id: "discover", name: "Discover People", icon: Search },
                        { id: "requests", name: "Requests", icon: Bell },
                        { id: "messages", name: "Messages", icon: MessageCircle },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-left transition-all ${activeTab === item.id
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
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                    {activeTab === 'overview' && 'Dashboard Overview'}
                                    {activeTab === 'discover' && 'Discover People'}
                                    {activeTab === 'requests' && 'Connection Requests'}
                                    {activeTab === 'messages' && 'Messages'}
                                    {activeTab === 'profile' && 'My Profile'}
                                </h1>
                            </div>

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-1 -right-1 border-2 border-white"></div>
                                        <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="font-medium text-gray-900">{user.username}</p>
                                        <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            to={`/profile/${user.uid}`}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                // Navigate to settings if you have a settings page
                                                setActiveTab('profile');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    {activeTab === 'overview' && (
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { 
                                        title: 'Connections', 
                                        value: dashboardStats.connections, 
                                        change: 'Your skillmates' 
                                    },
                                    { 
                                        title: 'Messages', 
                                        value: dashboardStats.messages, 
                                        change: 'Active conversations' 
                                    },
                                    { 
                                        title: 'Pending Requests', 
                                        value: dashboardStats.pendingRequests, 
                                        change: dashboardStats.pendingRequests > 0 ? 'Need attention' : 'All caught up'
                                    },
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                                <p className={`text-sm mt-1 ${stat.value > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {stat.change}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    className="bg-linear-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => setActiveTab('discover')}
                                >
                                    <h3 className="text-xl font-bold mb-2">Find People</h3>
                                    <p className="mb-4 opacity-90">Discover and connect with learners and teachers</p>
                                    <div className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block">
                                        Explore People
                                    </div>
                                </div>
                                <div
                                    className="bg-linear-to-r from-gray-900 to-black rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => setActiveTab('messages')}
                                >
                                    <h3 className="text-xl font-bold mb-2">Your Messages</h3>
                                    <p className="mb-4 opacity-90">Continue your conversations</p>
                                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors inline-block">
                                        View Messages
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'discover' && <UsersList />}
                    {activeTab === 'requests' && <ConnectionRequests />}
                    {activeTab === 'messages' && <Messaging />}
                    {activeTab === 'profile' && <ProfileSetup />}
                </main>
            </div>
        </div>
    );
}