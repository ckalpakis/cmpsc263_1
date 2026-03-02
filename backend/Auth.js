import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

function ensureAuthReady() {
  if (!auth) {
    throw new Error(
      "Firebase authentication is not configured. Check your NEXT_PUBLIC_FIREBASE_* variables."
    );
  }
}

export async function register(email, password, setUser) {
  ensureAuthReady();
  const response = await createUserWithEmailAndPassword(auth, email, password);
  if (setUser) {
    setUser(response.user);
  }
  return response.user;
}

export async function login(email, password, setUser) {
  ensureAuthReady();
  const response = await signInWithEmailAndPassword(auth, email, password);
  if (setUser) {
    setUser(response.user);
  }
  return response.user;
}

export async function isEmailInUse(email) {
  ensureAuthReady();
  const methods = await fetchSignInMethodsForEmail(auth, email);
  return methods.length > 0;
}

export async function logOut(setUser) {
  ensureAuthReady();
  await signOut(auth);
  if (setUser) {
    setUser(null);
  }
}
