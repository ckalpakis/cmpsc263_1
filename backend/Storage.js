import { storage } from "./Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadFile(path, file) {
  if (!storage) {
    throw new Error("Firebase storage is not configured.");
  }

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
