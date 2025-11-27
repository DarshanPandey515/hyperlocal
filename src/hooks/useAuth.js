// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const fullUserData = {
                            uid: user.uid,
                            email: user.email,
                            // Use 'name' field instead of 'username'
                            username: userData.name || userData.username || user.displayName || 'User',
                            name: userData.name || userData.username || user.displayName || 'User',
                            role: userData.role || 'learner',
                            isLoggedIn: true
                        };
                        setUser(fullUserData);
                        localStorage.setItem('hyperlocal_user', JSON.stringify(fullUserData));
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
                localStorage.removeItem('hyperlocal_user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return { user, loading, logout };
}