import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function DashboardHeader() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard Overview';
        if (path === '/dashboard/discover') return 'Discover People';
        if (path === '/dashboard/messages') return 'Messages';
        if (path === '/dashboard/requests') return 'Connection Requests';
        if (path === '/dashboard/profile') return 'My Profile';
        return 'Dashboard';
    };

    if (!user) return null;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                    </div>

                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-1 -right-1 border-2 border-white"></div>
                                <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                                </div>
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="font-medium text-gray-900">{user.username}</p>
                                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-58 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 cursor-pointer">
                                <Link
                                    to={`/profile/${user.uid}`}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User className="w-4 h-4" />
                                    <span>{user.name || "No Name"}</span>
                                </Link>
                                <Link
                                    to="/dashboard/profile"
                                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </Link>
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
    );
}