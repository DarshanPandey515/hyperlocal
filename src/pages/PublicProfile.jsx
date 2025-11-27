import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    MapPin,
    Star,
    Users,
    Award,
    Calendar,
    MessageCircle,
    Globe,
    Target,
    BookOpen,
    DollarSign,
    Clock,
    Zap,
    Languages,
    CheckCircle,
    Send,
    UserCheck,
    Edit,
    LogIn
} from 'lucide-react';

export default function PublicProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [existingConnection, setExistingConnection] = useState(null);
    const [sendingRequest, setSendingRequest] = useState(false);

    // Check if user is viewing their own profile
    const isOwnProfile = currentUser && userId === currentUser.uid;

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId, currentUser]);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                setProfileUser(null);
                return;
            }

            const userData = { id: snap.id, ...snap.data() };
            setProfileUser(userData);

            // Only check for existing connection if user is logged in AND it's NOT their own profile
            if (currentUser && !isOwnProfile) {
                await checkExistingConnection(userId);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkExistingConnection = async (userId) => {
        try {
            const connectionsRef = collection(db, 'connections');

            // Check both scenarios: current user as sender AND as receiver
            const sentQuery = query(
                connectionsRef,
                where('from', '==', currentUser.uid),
                where('to', '==', userId)
            );

            const receivedQuery = query(
                connectionsRef,
                where('from', '==', userId),
                where('to', '==', currentUser.uid)
            );

            const [sentSnapshot, receivedSnapshot] = await Promise.all([
                getDocs(sentQuery),
                getDocs(receivedQuery)
            ]);

            // Prioritize accepted connections first, then pending
            let connection = null;

            // Check received connections first (if someone sent you a request)
            if (!receivedSnapshot.empty) {
                const receivedConnections = receivedSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Find accepted connection first, then pending
                connection = receivedConnections.find(conn => conn.status === 'accepted') ||
                    receivedConnections.find(conn => conn.status === 'pending');
            }

            // If no received connection found, check sent connections
            if (!connection && !sentSnapshot.empty) {
                const sentConnections = sentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                connection = sentConnections.find(conn => conn.status === 'accepted') ||
                    sentConnections.find(conn => conn.status === 'pending');
            }

            if (connection) {
                setExistingConnection(connection);
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    };

    const sendConnectionRequest = async () => {
        if (!currentUser || !profileUser) {
            navigate('/auth/login');
            return;
        }

        // Check if connection already exists before sending
        if (existingConnection) {
            if (existingConnection.status === 'accepted') {
                alert('You are already connected with this user!');
                return;
            } else if (existingConnection.status === 'pending') {
                alert('Connection request already sent!');
                return;
            }
        }

        setSendingRequest(true);
        try {
            await addDoc(collection(db, 'connections'), {
                from: currentUser.uid,
                fromName: currentUser.username || currentUser.name || "User",
                to: profileUser.id,
                toName: profileUser.name,
                status: 'pending',
                timestamp: serverTimestamp()
            });

            setExistingConnection({ status: 'pending' });
            alert('Connection request sent! You\'ll be Skillmates once they accept.');
        } catch (error) {
            console.error('Error sending request:', error);
            alert('Failed to send request. Please try again.');
        } finally {
            setSendingRequest(false);
        }
    };

    const getConnectionStatus = () => {
        if (!currentUser) return 'not_logged_in';
        if (isOwnProfile) return 'own_profile';
        if (!existingConnection) return 'connect';
        return existingConnection.status === 'accepted' ? 'skillmates' :
            existingConnection.status === 'pending' ? 'request_sent' : 'connect';
    };

    const getConnectionButtonConfig = () => {
        const status = getConnectionStatus();
        const configs = {
            not_logged_in: {
                text: 'Login to Connect',
                icon: LogIn,
                style: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25',
                action: () => navigate('/auth/login'),
                disabled: false
            },
            own_profile: {
                text: 'Edit Profile',
                icon: Edit,
                style: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform shadow-lg shadow-blue-500/25',
                action: () => navigate('/dashboard/profile'),
                disabled: false
            },
            connect: {
                text: 'Connect as Skillmates',
                icon: Send,
                style: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25',
                action: sendConnectionRequest,
                disabled: false
            },
            request_sent: {
                text: 'Request Sent',
                icon: Clock,
                style: 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed',
                action: null,
                disabled: true
            },
            skillmates: {
                text: 'Skillmates',
                icon: UserCheck,
                style: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 transition-transform shadow-lg shadow-green-500/25',
                action: () => navigate('/dashboard?tab=messages'),
                disabled: false
            }
        };
        return configs[status] || configs.not_logged_in;
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-32 pb-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!profileUser) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-white pt-32 pb-20">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            The user profile you're looking for doesn't exist or may have been removed.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const connectionConfig = getConnectionButtonConfig();
    const ConnectionIcon = connectionConfig.icon;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white pt-32 pb-20">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-400/5 via-white to-white"></div>
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-6xl mx-auto">
                            {/* Profile Header */}
                            <div className="text-center mb-12">
                                <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                    {profileUser.name?.charAt(0).toUpperCase()}
                                </div>

                                <h1 className="text-5xl font-bold text-gray-900 mb-4">{profileUser.name}</h1>

                                <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-5 h-5" />
                                        <span className="text-lg">{profileUser.location || 'Location not set'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Award className="w-5 h-5" />
                                        <span className="text-lg capitalize">{profileUser.role || 'community member'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span className="text-lg font-semibold">{profileUser.rating || 'New'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button
                                        onClick={connectionConfig.action}
                                        disabled={connectionConfig.disabled || sendingRequest}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${connectionConfig.style} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <ConnectionIcon className="w-5 h-5" />
                                        {sendingRequest ? 'Sending...' : connectionConfig.text}
                                    </button>

                                    {/* Only show message button if user is logged in and already connected */}
                                    {currentUser && existingConnection?.status === 'accepted' && (
                                        <button
                                            onClick={() => navigate('/dashboard?tab=messages')}
                                            className="flex items-center gap-3 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Send Message
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Skills & About */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* About Section */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <BookOpen className="w-6 h-6 text-yellow-500" />
                                            <h2 className="text-2xl font-bold text-gray-900">About</h2>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {profileUser.bio || `${profileUser.name} is passionate about sharing knowledge and learning new skills within the community.`}
                                        </p>
                                    </div>

                                    {/* Skills & Expertise */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Target className="w-6 h-6 text-yellow-500" />
                                            <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Expertise Level */}
                                            {profileUser.expertiseLevel && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Expertise Level</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className="bg-linear-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                                                                style={{
                                                                    width: profileUser.expertiseLevel === 'beginner' ? '25%' :
                                                                        profileUser.expertiseLevel === 'intermediate' ? '50%' :
                                                                            profileUser.expertiseLevel === 'advanced' ? '75%' : '100%'
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-lg font-medium text-gray-700 capitalize min-w-32">
                                                            {profileUser.expertiseLevel}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Skills */}
                                            {profileUser.skills?.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Skills</h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {profileUser.skills.map((skill, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-2 bg-linear-to-r from-yellow-400/10 to-yellow-500/10 text-yellow-700 border border-yellow-400/20 px-4 py-3 rounded-xl font-medium hover:shadow-md transition-shadow"
                                                            >
                                                                <Zap className="w-4 h-4" />
                                                                {skill}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Languages */}
                                            {profileUser.languages?.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Languages</h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {profileUser.languages.map((language, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded-xl font-medium"
                                                            >
                                                                <Languages className="w-4 h-4" />
                                                                {language}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Stats & Info */}
                                <div className="space-y-8">
                                    {/* Community Stats */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Users className="w-6 h-6 text-yellow-500" />
                                            <h3 className="text-xl font-bold text-gray-900">Community Stats</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 font-medium">Skillmates</span>
                                                <span className="text-2xl font-bold text-gray-900">{profileUser.totalConnections || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 font-medium">Sessions</span>
                                                <span className="text-2xl font-bold text-gray-900">{profileUser.totalSessions || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 font-medium">Rating</span>
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                    <span className="text-2xl font-bold text-gray-900">{profileUser.rating || 'New'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    {profileUser.pricing?.rate && (
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <DollarSign className="w-5 h-5 text-yellow-500" />
                                                <h3 className="text-xl font-bold text-gray-900">Pricing</h3>
                                            </div>

                                            <div className="text-center p-6 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-xl mb-4">
                                                <div className="text-3xl font-bold text-black mb-2">
                                                    {profileUser.pricing.currency === 'INR' ? '₹' :
                                                        profileUser.pricing.currency === 'USD' ? '$' : '€'}
                                                    {profileUser.pricing.rate}
                                                </div>
                                                <div className="text-black text-lg capitalize font-medium">
                                                    per {profileUser.pricing.rateType?.replace('_', ' ')}
                                                </div>
                                            </div>

                                            {profileUser.pricing.freeInitialConsultation && (
                                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <span className="text-green-700 font-medium">Free initial consultation</span>
                                                </div>
                                            )}

                                            {profileUser.pricing.packageDeals?.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-lg mb-3">Package Deals</h4>
                                                    <div className="space-y-3">
                                                        {profileUser.pricing.packageDeals.map((pkg, index) => (
                                                            <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                                <div className="font-semibold text-blue-900 text-lg">
                                                                    {pkg.sessions} sessions - {profileUser.pricing.currency === 'INR' ? '₹' : '$'}{pkg.price}
                                                                </div>
                                                                {pkg.discount > 0 && (
                                                                    <div className="text-green-600 text-sm font-medium">
                                                                        Save {pkg.discount}%
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Availability */}
                                    {profileUser.availability && (
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Calendar className="w-5 h-5 text-yellow-500" />
                                                <h3 className="text-xl font-bold text-gray-900">Availability</h3>
                                            </div>

                                            <div className="space-y-3">
                                                {Object.entries(profileUser.availability).map(([day, data]) => (
                                                    <div key={day} className="flex items-center justify-between py-2">
                                                        <span className="font-medium capitalize text-gray-900 w-28">{day}</span>
                                                        <div className="flex-1 flex items-center gap-3">
                                                            {data.available ? (
                                                                <>
                                                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                                    <span className="text-sm text-gray-600 font-medium">
                                                                        {data.times?.length > 0 ? data.times.join(', ') : 'Available all day'}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                                    <span className="text-sm text-gray-400">Not available</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Social Links */}
                                    {profileUser.socialLinks && Object.values(profileUser.socialLinks).some(url => url) && (
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Globe className="w-5 h-5 text-yellow-500" />
                                                <h3 className="text-xl font-bold text-gray-900">Connect</h3>
                                            </div>

                                            <div className="space-y-3">
                                                {Object.entries(profileUser.socialLinks).map(([platform, url]) => (
                                                    url && (
                                                        <a
                                                            key={platform}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-400/5 transition-all group"
                                                        >
                                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/10 transition-colors">
                                                                <Globe className="w-4 h-4 text-gray-600 group-hover:text-yellow-500" />
                                                            </div>
                                                            <span className="font-medium text-gray-700 capitalize">{platform}</span>
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}