import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  fromDate: string; // stored as YYYY-MM-DD
  toDate: string;   // stored as YYYY-MM-DD
  status: "Active" | "Inactive";
}

export function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readUsers(): User[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

export function writeUsers(users: User[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users:", error);
    throw new Error("Failed to write to database");
  }
}

export function findUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export function findUserByPhone(phoneNumber: string): User | undefined {
  return readUsers().find((u) => u.phoneNumber === phoneNumber);
}

export function phoneNumberExists(phoneNumber: string, excludeId?: string): boolean {
  return readUsers().some(
    (u) => u.phoneNumber === phoneNumber && u.id !== excludeId
  );
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
