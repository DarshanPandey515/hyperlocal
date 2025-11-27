// components/UsersList.jsx (updated)
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { UserCheck, MessageCircle } from 'lucide-react';
import SearchComponent from './SearchComponent';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingRequest, setSendingRequest] = useState(null);
    const [existingConnections, setExistingConnections] = useState([]);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
            fetchExistingConnections();
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            const usersList = [];
            usersSnapshot.forEach(doc => {
                const userData = doc.data();

                // Only add users that are not the current user
                if (doc.id !== currentUser.uid) {
                    usersList.push({
                        id: doc.id,
                        username: userData.name || userData.username || 'Unknown User',
                        role: userData.role || 'learner',
                        bio: userData.bio || '',
                        skills: userData.skills || [],
                        location: userData.location || '',
                        availability: userData.availability || '',
                        photoURL: userData.photoURL || '',
                        email: userData.email || ''
                    });
                }
            });

            setUsers(usersList);

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingConnections = async () => {
        if (!currentUser) return;

        try {
            const connectionsRef = collection(db, 'connections');
            const q = query(
                connectionsRef,
                where('from', '==', currentUser.uid)
            );

            const snapshot = await getDocs(q);
            const connections = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Also fetch connections where current user is the receiver
            const receivedConnectionsQuery = query(
                connectionsRef,
                where('to', '==', currentUser.uid)
            );
            const receivedSnapshot = await getDocs(receivedConnectionsQuery);
            const receivedConnections = receivedSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setExistingConnections([...connections, ...receivedConnections]);
        } catch (error) {
            console.error('Error fetching connections:', error);
        }
    };

    const sendConnectionRequest = async (toUserId, toUserName) => {
        if (!currentUser) return;

        setSendingRequest(toUserId);
        try {
            // Check if connection already exists in any status
            const existingConnection = existingConnections.find(
                conn => (conn.to === toUserId || conn.from === toUserId)
            );

            if (existingConnection) {
                if (existingConnection.status === 'pending') {
                    alert('Connection request already sent!');
                } else if (existingConnection.status === 'accepted') {
                    alert('You are already connected with this user!');
                }
                return;
            }

            const connectionData = {
                from: currentUser.uid,
                fromName: currentUser.username || currentUser.name || 'Unknown User',
                to: toUserId,
                toName: toUserName,
                status: 'pending',
                timestamp: serverTimestamp()
            };

            await addDoc(collection(db, 'connections'), connectionData);

            // Update local state
            setExistingConnections(prev => [...prev, {
                from: currentUser.uid,
                to: toUserId,
                status: 'pending'
            }]);

            alert('Connection request sent successfully!');
        } catch (error) {
            console.error('Error sending request:', error);
            alert(`Failed to send request: ${error.message}`);
        } finally {
            setSendingRequest(null);
        }
    };

    const getConnectionStatus = (userId) => {
        const connection = existingConnections.find(
            conn => (conn.to === userId || conn.from === userId)
        );

        if (!connection) return 'not_connected';

        if (connection.status === 'pending') {
            return connection.from === currentUser.uid ? 'request_sent' : 'request_received';
        }

        if (connection.status === 'accepted') return 'connected';

        return 'not_connected';
    };

    const formatAvailability = (availability) => {
        if (!availability || typeof availability !== 'object') {
            return 'Not specified';
        }

        if (typeof availability === 'string') {
            return availability;
        }

        const availableDays = Object.entries(availability)
            .filter(([day, data]) => data.available)
            .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

        if (availableDays.length === 0) {
            return 'Not available';
        }

        return availableDays.join(', ');
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Find People to Connect With</h1>
                <div className="flex justify-center items-center h-32">
                    <div className="text-lg">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Find People to Connect With</h1>

                <SearchComponent
                    variant="hero"
                    placeholder="Search for skills like 'guitar lessons', 'yoga classes', 'coding tutor'..."
                    className="mx-auto mb-12"
                />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => {
                    const connectionStatus = getConnectionStatus(user.id);

                    return (
                        <div key={user.id} className="bg-white rounded-lg shadow-md p-4 border">
                            <div className="flex items-center gap-3 mb-3">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        <Link to={`/profile/${user.id}`}>
                                            {user.username}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-600 capitalize">{user.role || 'Member'}</p>
                                    {user.location && user.location !== 'Not set' && (
                                        <p className="text-xs text-gray-500">{user.location}</p>
                                    )}
                                </div>
                            </div>

                            {user.bio && user.bio !== "Hi, I'm new to Hyperlocal and looking to learn new skills!" && (
                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{user.bio}</p>
                            )}

                            {user.skills && user.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {user.skills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                    {user.skills.length > 3 && (
                                        <span className="text-gray-500 text-xs">+{user.skills.length - 3} more</span>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-gray-600 mb-3">
                                Available: {formatAvailability(user.availability)}
                            </p>

                            <div className="flex gap-2">
                                {connectionStatus === 'connected' && (
                                    <>
                                        <button
                                            onClick={() => window.location.href = '/dashboard?tab=messages'}
                                            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Message
                                        </button>
                                        <div className="flex items-center justify-center px-3 bg-green-100 text-green-700 rounded-lg">
                                            <UserCheck className="w-4 h-4" />
                                        </div>
                                    </>
                                )}
                                {connectionStatus === 'request_sent' && (
                                    <button
                                        disabled
                                        className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-medium cursor-not-allowed"
                                    >
                                        Request Sent
                                    </button>
                                )}
                                {connectionStatus === 'request_received' && (
                                    <button
                                        onClick={() => window.location.href = '/dashboard?tab=requests'}
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        View Request
                                    </button>
                                )}
                                {connectionStatus === 'not_connected' && (
                                    <button
                                        onClick={() => sendConnectionRequest(user.id, user.username)}
                                        disabled={sendingRequest === user.id}
                                        className="w-full bg-yellow-400 text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
                                    >
                                        {sendingRequest === user.id ? 'Sending...' : 'Connect'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No other users found.
                </div>
            )}
        </div>
    );
}