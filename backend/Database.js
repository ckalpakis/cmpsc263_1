import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { database } from "./Firebase";

function ensureDatabaseReady() {
  if (!database) {
    throw new Error(
      "Firebase Firestore is not configured. Check your NEXT_PUBLIC_FIREBASE_* variables."
    );
  }
}

function normalizeAssignments(items) {
  return [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function getAssignmentsCollection(ownerId) {
  ensureDatabaseReady();

  if (!ownerId) {
    throw new Error("A signed-in user is required to access assignments.");
  }

  return collection(database, "users", ownerId, "assignments");
}

export async function getAssignments(ownerId) {
  const snapshot = await getDocs(getAssignmentsCollection(ownerId));
  const assignments = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  return normalizeAssignments(assignments);
}

export async function createAssignment(ownerId, values) {
  const payload = {
    ...values,
    ownerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const response = await addDoc(getAssignmentsCollection(ownerId), payload);

  return {
    id: response.id,
    ...payload,
  };
}

export async function updateAssignment(ownerId, assignmentId, values) {
  const updatedValues = {
    ...values,
    updatedAt: new Date().toISOString(),
  };

  ensureDatabaseReady();

  if (!ownerId) {
    throw new Error("A signed-in user is required to update assignments.");
  }

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

export async function removeAssignment(ownerId, assignmentId) {
  ensureDatabaseReady();

  if (!ownerId) {
    throw new Error("A signed-in user is required to delete assignments.");
  }

  await deleteDoc(doc(database, "users", ownerId, "assignments", assignmentId));
}
