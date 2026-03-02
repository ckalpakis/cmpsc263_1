import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { database } from "./Firebase";

const LOCAL_ASSIGNMENTS_KEY = "studybuddy-local-assignments";

function isBrowser() {
  return typeof window !== "undefined";
}

function readLocalAssignments() {
  if (!isBrowser()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    console.error("Failed to load local assignments", error);
    return [];
  }
}

function writeLocalAssignments(assignments) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

function normalizeAssignments(items) {
  return [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getAssignments(ownerId = "guest") {
  if (database && ownerId !== "guest") {
    const snapshot = await getDocs(collection(database, "users", ownerId, "assignments"));
    const assignments = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    return normalizeAssignments(assignments);
  }

  const assignments = readLocalAssignments().filter(
    (assignment) => assignment.ownerId === ownerId
  );
  return normalizeAssignments(assignments);
}

export async function createAssignment(ownerId, values) {
  const payload = {
    ...values,
    ownerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (database && ownerId !== "guest") {
    const response = await addDoc(
      collection(database, "users", ownerId, "assignments"),
      payload
    );
    return {
      id: response.id,
      ...payload,
    };
  }

  const assignments = readLocalAssignments();
  const localAssignment = {
    id: `local-${Date.now()}`,
    ...payload,
  };
  assignments.push(localAssignment);
  writeLocalAssignments(assignments);
  return localAssignment;
}

export async function updateAssignment(ownerId, assignmentId, values) {
  const updatedValues = {
    ...values,
    updatedAt: new Date().toISOString(),
  };

  if (database && ownerId !== "guest") {
    await updateDoc(
      doc(database, "users", ownerId, "assignments", assignmentId),
      updatedValues
    );
    return {
      id: assignmentId,
      ownerId,
      ...updatedValues,
    };
  }

  const assignments = readLocalAssignments().map((assignment) =>
    assignment.id === assignmentId
      ? {
          ...assignment,
          ...updatedValues,
        }
      : assignment
  );

  writeLocalAssignments(assignments);
  return assignments.find((assignment) => assignment.id === assignmentId) || null;
}

export async function removeAssignment(ownerId, assignmentId) {
  if (database && ownerId !== "guest") {
    await deleteDoc(doc(database, "users", ownerId, "assignments", assignmentId));
    return;
  }

  const assignments = readLocalAssignments().filter(
    (assignment) => assignment.id !== assignmentId
  );
  writeLocalAssignments(assignments);
}

