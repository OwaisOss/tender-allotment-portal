import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers, validateUser, phoneNumberExists, findUserById } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateUser(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserById(data.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if phone number is being changed and if new one exists
    if (data.phoneNumber !== user.phoneNumber && await phoneNumberExists(data.phoneNumber)) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Update user
    const users = await readUsers();
    const index = users.findIndex((u) => u.id === data.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    users[index] = {
      ...users[index],
      name: data.name.trim(),
      phoneNumber: data.phoneNumber,
      fromDate: data.fromDate,
      toDate: data.toDate,
    };

    await writeUsers(users);

    return NextResponse.json(users[index], { status: 200 });
  } catch (error) {
    console.error("Edit user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
