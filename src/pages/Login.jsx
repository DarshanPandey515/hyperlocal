import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Default credentials
    const DEFAULT_CREDENTIALS = {
        username: 'darshan',
        password: 'passsword123'
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        // Check against default credentials
        if (formData.username === DEFAULT_CREDENTIALS.username && formData.password === DEFAULT_CREDENTIALS.password) {
            // Store user in localStorage
            const userData = {
                username: formData.username,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('hyperlocal_user', JSON.stringify(userData));
            navigate('/dashboard');
        } else {
            // Check if user exists in localStorage (for signed up users)
            const existingUsers = JSON.parse(localStorage.getItem('hyperlocal_users') || '[]');
            const user = existingUsers.find(u => u.username === formData.username && u.password === formData.password);

            if (user) {
                const userData = {
                    username: user.username,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('hyperlocal_user', JSON.stringify(userData));
                navigate('/dashboard');
            } else {
                setError('Invalid username or password');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-linear-to-br from-white via-white to-gray-100 pt-20">
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-md mx-auto bg-white p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 font-medium mb-1">Demo Credentials:</p>
                                <p className="text-sm text-yellow-700">Username: darshan</p>
                                <p className="text-sm text-yellow-700">Password: passsword123</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/auth/signup" className="text-yellow-500 font-semibold hover:text-yellow-600 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}