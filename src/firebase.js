import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

// ⚠️ IMPORTANT: Replace these with your Firebase project config
// Go to: https://console.firebase.google.com/
// 1. Create a new project (or use existing)
// 2. Add a web app to get these credentials
// 3. Enable Firestore Database in the Firebase console
// 4. Set Firestore rules to allow read/write (see README)

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection reference
const referralsCollection = collection(db, 'referrals');

// Add a new referral
export const addReferral = async (referralData) => {
  try {
    const docRef = await addDoc(referralsCollection, {
      ...referralData,
      upvotes: 0,
      downvotes: 0,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...referralData, upvotes: 0, downvotes: 0 };
  } catch (error) {
    console.error('Error adding referral:', error);
    throw error;
  }
};

// Get all referrals
export const getReferrals = async () => {
  try {
    const q = query(referralsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting referrals:', error);
    throw error;
  }
};

// Update votes
export const updateVotes = async (referralId, upvotes, downvotes) => {
  try {
    const docRef = doc(db, 'referrals', referralId);
    await updateDoc(docRef, { upvotes, downvotes });
  } catch (error) {
    console.error('Error updating votes:', error);
    throw error;
  }
};

export { db };
