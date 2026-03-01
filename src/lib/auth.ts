import { cookies } from "next/headers";

const SECRET = "subscription-portal-secret-key-change-in-production";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

interface JWTPayload {
  username: string;
  iat: number;
  exp: number;
}

// Simple JWT implementation (not production-grade)
export function generateJWT(username: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    username,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 hours
  };

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64"
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = Buffer.from(
    `${header}.${body}.${SECRET}`
  ).toString("base64");

  return `${header}.${body}.${signature}`;
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth");
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie();
  if (!token) return false;
  return verifyJWT(token) !== null;
}
