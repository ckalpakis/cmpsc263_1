import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";

const DEMO_USERS_KEY = "studybuddy-demo-users";
const DEMO_SESSION_KEY = "studybuddy-demo-session";

function isBrowser() {
  return typeof window !== "undefined";
}

function readLocalJson(key, fallbackValue) {
  if (!isBrowser()) {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch (error) {
    console.error(`Failed to read local storage key "${key}"`, error);
    return fallbackValue;
  }
}

function writeLocalJson(key, value) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function buildDemoUser(record) {
  return {
    uid: record.uid,
    email: record.email,
    isDemoUser: true,
  };
}

export async function register(email, password, setUser) {
  if (auth) {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    if (setUser) {
      setUser(response.user);
    }
    return response.user;
  }

  const users = readLocalJson(DEMO_USERS_KEY, []);
  const normalizedEmail = email.trim().toLowerCase();
  const emailAlreadyInUse = users.some((user) => user.email === normalizedEmail);

  if (emailAlreadyInUse) {
    throw new Error("An account already exists with that email.");
  }

  const nextUser = {
    uid: `demo-${Date.now()}`,
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(nextUser);
  writeLocalJson(DEMO_USERS_KEY, users);
  const sessionUser = buildDemoUser(nextUser);
  writeLocalJson(DEMO_SESSION_KEY, sessionUser);

  if (setUser) {
    setUser(sessionUser);
  }

  return sessionUser;
}

export async function login(email, password, setUser) {
  if (auth) {
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (setUser) {
      setUser(response.user);
    }
    return response.user;
  }

  const users = readLocalJson(DEMO_USERS_KEY, []);
  const normalizedEmail = email.trim().toLowerCase();
  const matchingUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password
  );

  if (!matchingUser) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser = buildDemoUser(matchingUser);
  writeLocalJson(DEMO_SESSION_KEY, sessionUser);

  if (setUser) {
    setUser(sessionUser);
  }

  return sessionUser;
}

export async function isEmailInUse(email) {
  if (auth) {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  }

  const users = readLocalJson(DEMO_USERS_KEY, []);
  return users.some((user) => user.email === email.trim().toLowerCase());
}

export async function logOut(setUser) {
  if (auth) {
    await signOut(auth);
  } else if (isBrowser()) {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  }

  if (setUser) {
    setUser(null);
  }
}

export function getPersistedDemoUser() {
  return readLocalJson(DEMO_SESSION_KEY, null);
}
