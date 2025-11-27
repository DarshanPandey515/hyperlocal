import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDty5os84VgLNRZTDAHErleYUOc9zBnaa0",
  authDomain: "hyperlocall.firebaseapp.com",
  projectId: "hyperlocall",
  storageBucket: "hyperlocall.appspot.com",
  messagingSenderId: "43216293091",
  appId: "1:43216293091:web:8b4b2de5dbd428e2f389d6",
  measurementId: "G-13PVX571LT"
};  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;