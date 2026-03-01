import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  fromDate: string; // stored as YYYY-MM-DD
  toDate: string;   // stored as YYYY-MM-DD
  status: "Active" | "Inactive";
}

export async function readUsers(): Promise<User[]> {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map((doc) => doc.data() as User);
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

export async function writeUsers(users: User[]): Promise<void> {
  try {
    // Get existing docs and delete them
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    const deletePromises = snapshot.docs.map((d) =>
      deleteDoc(doc(db, USERS_COLLECTION, d.id))
    );
    await Promise.all(deletePromises);

    // Write all users
    const writePromises = users.map((user) =>
      setDoc(doc(db, USERS_COLLECTION, user.id), user)
    );
    await Promise.all(writePromises);
  } catch (error) {
    console.error("Error writing users:", error);
    throw new Error("Failed to write to database");
  }
}

export async function findUserById(id: string): Promise<User | undefined> {
  try {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, id));
    return docSnap.exists() ? (docSnap.data() as User) : undefined;
  } catch (error) {
    console.error("Error finding user by id:", error);
    return undefined;
  }
}

export async function findUserByPhone(phoneNumber: string): Promise<User | undefined> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("phoneNumber", "==", phoneNumber)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? undefined : (snapshot.docs[0].data() as User);
  } catch (error) {
    console.error("Error finding user by phone:", error);
    return undefined;
  }
}

export async function phoneNumberExists(phoneNumber: string, excludeId?: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("phoneNumber", "==", phoneNumber)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.some((d) => d.id !== excludeId);
  } catch (error) {
    console.error("Error checking phone number:", error);
    return false;
  }
}

// Accepts dates in YYYY-MM-DD format (native date input)
export function validateUser(data: any): { valid: boolean; error?: string } {
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    return { valid: false, error: "Name is required" };
  }
  if (!data.phoneNumber || typeof data.phoneNumber !== "string") {
    return { valid: false, error: "Phone number is required" };
  }
  if (!/^\d{10}$/.test(data.phoneNumber)) {
    return { valid: false, error: "Phone number must be 10 digits" };
  }
  if (!data.fromDate || typeof data.fromDate !== "string") {
    return { valid: false, error: "From date is required" };
  }
  if (!data.toDate || typeof data.toDate !== "string") {
    return { valid: false, error: "To date is required" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fromDate)) {
    return { valid: false, error: "Invalid from date" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.toDate)) {
    return { valid: false, error: "Invalid to date" };
  }
  if (new Date(data.fromDate) >= new Date(data.toDate)) {
    return { valid: false, error: "To date must be after from date" };
  }
  return { valid: true };
}

// Convert YYYY-MM-DD to DD-MM-YYYY for display
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}
