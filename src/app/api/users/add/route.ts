import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers, validateUser, phoneNumberExists } from "@/lib/db";
import { generateUUID } from "@/lib/uuid";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate input
    const validation = validateUser(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    if (await phoneNumberExists(data.phoneNumber)) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const users = await readUsers();
    const newUser = {
      id: generateUUID(),
      name: data.name.trim(),
      phoneNumber: data.phoneNumber,
      fromDate: data.fromDate,
      toDate: data.toDate,
      status: "Active" as const,
    };

    users.push(newUser);
    await writeUsers(users);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Add user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
