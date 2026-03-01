import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers, findUserById } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = findUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    const users = readUsers();
    const filteredUsers = users.filter((u) => u.id !== id);
    writeUsers(filteredUsers);

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
