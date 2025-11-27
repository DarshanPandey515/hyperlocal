// components/ConnectionRequests.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

export default function ConnectionRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const requestsRef = collection(db, 'connections');
        const q = query(
            requestsRef,
            where('to', '==', currentUser.uid),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestsList = [];
            snapshot.forEach(doc => {
                requestsList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setRequests(requestsList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching requests:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleRequest = async (requestId, status) => {
        if (!currentUser) return;

        setProcessing(requestId);
        try {
            const requestRef = doc(db, 'connections', requestId);

            // Only update the status field to comply with security rules
            await updateDoc(requestRef, {
                status: status,
                respondedAt: serverTimestamp()
            });

            console.log(`Request ${status} successfully`);

            if (status === 'accepted') {
                // Create chat room
                const request = requests.find(r => r.id === requestId);
                if (request) {
                    try {
                        await addDoc(collection(db, 'chats'), {
                            connectionId: requestId,
                            participants: [currentUser.uid, request.from],
                            participantNames: {
                                [currentUser.uid]: currentUser.username || currentUser.name || 'Unknown User',
                                [request.from]: request.fromName || 'Unknown User'
                            },
                            createdAt: serverTimestamp(),
                            lastMessage: null,
                            lastMessageAt: null
                        });
                        console.log('Chat room created successfully');
                    } catch (chatError) {
                        console.error('Error creating chat room:', chatError);
                        // Don't fail the whole operation if chat creation fails
                    }
                }
            }

            alert(`Request ${status}!`);
        } catch (error) {
            console.error('Error processing request:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                requestId: requestId,
                currentUser: currentUser.uid
            });
            alert(`Failed to process request: ${error.message}`);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Connection Requests</h1>
                <div className="flex justify-center items-center h-32">
                    <div className="text-lg">Loading requests...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Connection Requests</h1>

            <div className="space-y-4">
                {requests.map(request => (
                    <div key={request.id} className="bg-white rounded-lg shadow-md p-4 border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {request.fromName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {request.fromName || 'Unknown User'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Wants to connect with you
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {request.timestamp?.toDate?.()?.toLocaleDateString() || 'Recently'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRequest(request.id, 'accepted')}
                                    disabled={processing === request.id}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {processing === request.id ? 'Processing...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleRequest(request.id, 'rejected')}
                                    disabled={processing === request.id}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {processing === request.id ? 'Processing...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {requests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No pending connection requests.
                </div>
            )}
        </div>
    );
}