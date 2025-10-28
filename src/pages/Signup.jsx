import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Check if username already exists
        const existingUsers = JSON.parse(localStorage.getItem('hyperlocal_users') || '[]');
        const userExists = existingUsers.find(user => user.username === formData.username);

        if (userExists) {
            setError('Username already exists');
            return;
        }

        // Save new user
        const newUser = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('hyperlocal_users', JSON.stringify(updatedUsers));

        // Auto-login after signup
        const userData = {
            username: newUser.username,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('hyperlocal_user', JSON.stringify(userData));

        navigate('/');
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-linear-to-br from-white via-white to-gray-100 pt-20">
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-md mx-auto bg-white p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                            <p className="text-gray-600 mt-2">Join the community today</p>
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
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                                    placeholder="Enter your email"
                                    required
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
                                    placeholder="Create a password"
                                    required
                                    minLength="6"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/auth/login" className="text-yellow-500 font-semibold hover:text-yellow-600 transition-colors">
                                    Sign in
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