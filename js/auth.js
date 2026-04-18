import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data().role;
    return null;
  } catch (e) { return null; }
}

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  try { await signOut(auth); window.location.href = '/index.html'; } catch (e) { console.error(e); }
}

export function requireAuth(allowedRoles = []) {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = '/index.html'; reject('not-logged-in'); return; }
      const role = await getUserRole(user.uid);
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) { window.location.href = '/index.html'; reject('unauthorized'); return; }
      resolve({ user, role });
    });
  });
}

export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) { return null; }
}

export { sendPasswordResetEmail, auth };
