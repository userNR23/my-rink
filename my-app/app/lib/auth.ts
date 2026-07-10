import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

// Only this email is treated as the site owner in the UI. The real
// enforcement lives in Firestore security rules — this is just for
// showing/hiding the mypage UI.
export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'wkqrha628@gmail.com';

export function isOwner(user: User | null): boolean {
  return !!user && user.email === OWNER_EMAIL;
}

export function watchAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
