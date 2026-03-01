import { put, get } from "@vercel/blob";

const BLOB_FILENAME = "users.json";

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
    // Use get() to read directly via authenticated API — bypasses CDN cache entirely
    const result = await get(BLOB_FILENAME, { access: "public" });
    if (!result || result.statusCode !== 200 || !result.stream) return [];
    // Convert ReadableStream to text
    const response = new Response(result.stream);
    const data = await response.text();
    return data.trim() ? JSON.parse(data) : [];
  } catch (error: any) {
    // Blob not found (first run) — return empty array
    if (error?.code === "blob_not_found" || error?.name === "BlobNotFoundError") {
      return [];
    }
    console.error("Error reading users:", error);
    return [];
  }
}

export async function writeUsers(users: User[]): Promise<void> {
  try {
    await put(BLOB_FILENAME, JSON.stringify(users, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });
  } catch (error) {
    console.error("Error writing users:", error);
    throw new Error("Failed to write to database");
  }
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function findUserByPhone(phoneNumber: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.phoneNumber === phoneNumber);
}

export async function phoneNumberExists(phoneNumber: string, excludeId?: string): Promise<boolean> {
  const users = await readUsers();
  return users.some((u) => u.phoneNumber === phoneNumber && u.id !== excludeId);
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
