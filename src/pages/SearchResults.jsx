import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchComponent from '../components/SearchComponent';
import { MapPin, Star, Users, Filter, X, Zap } from 'lucide-react';

function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: 'all',
        expertise: 'all'
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const queryParam = urlParams.get('q');
        if (queryParam) {
            setSearchQuery(queryParam);
            searchUsers(queryParam);
        }
    }, [location]);

    const searchUsers = async (query) => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const results = [];

            snapshot.forEach(doc => {
                const userData = doc.data();
                const searchableText = [
                    ...(userData.skills || []),
                    userData.bio || '',
                    userData.name || '',
                    userData.role || '',
                    userData.location || '',
                    userData.expertiseLevel || '',
                    ...(userData.languages || [])
                ].join(' ').toLowerCase();

                if (searchableText.includes(query.toLowerCase())) {
                    results.push({
                        id: doc.id,
                        ...userData,
                        relevance: calculateRelevance(userData, query)
                    });
                }
            });

            results.sort((a, b) => b.relevance - a.relevance);
            setUsers(results);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateRelevance = (userData, query) => {
        let relevance = 0;
        const queryLower = query.toLowerCase();

        if (userData.skills) {
            userData.skills.forEach(skill => {
                if (skill.toLowerCase() === queryLower) relevance += 5;
                else if (skill.toLowerCase().includes(queryLower)) relevance += 3;
            });
        }

        if (userData.name?.toLowerCase().includes(queryLower)) relevance += 4;
        if (userData.location?.toLowerCase().includes(queryLower)) relevance += 3;
        if (userData.bio?.toLowerCase().includes(queryLower)) relevance += 2;
        if (userData.role?.toLowerCase().includes(queryLower)) relevance += 2;

        return relevance;
    };

    const filteredUsers = users.filter(user => {
        if (filters.role !== 'all' && user.role !== filters.role) return false;
        if (filters.expertise !== 'all' && user.expertiseLevel !== filters.expertise) return false;
        return true;
    });

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ← Back
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
                        </div>

                        <SearchComponent
                            placeholder="Search for skills, teachers, or topics..."
                            className="mb-6"
                        />

                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                {loading ? 'Searching...' : `Found ${filteredUsers.length} results for "${searchQuery}"`}
                            </p>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>

                        {showFilters && (
                            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            value={filters.role}
                                            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="learner">Learner</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                                        <select
                                            value={filters.expertise}
                                            onChange={(e) => setFilters(prev => ({ ...prev, expertise: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                        >
                                            <option value="all">All Levels</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                <div className="h-3 bg-gray-200 rounded w-32"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => navigate(`/profile/${user.id}`)}
                                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-yellow-400 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                                    {user.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{user.location || 'Location not set'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {user.role && (
                                                <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    <Users className="w-3 h-3" />
                                                    {user.role}
                                                </div>
                                            )}

                                            {user.skills?.slice(0, 3).map((skill, index) => (
                                                <div
                                                    key={index}
                                                    className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium mr-2"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    {skill}
                                                </div>
                                            ))}

                                            {user.bio && (
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {user.bio}
                                                </p>
                                            )}

                                            {user.pricing?.rate && (
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {user.pricing.currency === 'INR' ? '₹' : '$'}{user.pricing.rate}
                                                        <span className="text-gray-500 text-xs font-normal ml-1">
                                                            /{user.pricing.rateType?.replace('_', ' ')}
                                                        </span>
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                        <span className="text-xs text-gray-600">{user.rating || 'New'}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
                            <p className="text-gray-600 mb-6">
                                We couldn't find any matches for "{searchQuery}". Try searching for something else.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}


export default SearchResults;