import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers, findUserById } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["Active", "Inactive"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'Active' or 'Inactive'" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update status
    const users = await readUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    users[index].status = status;
    await writeUsers(users);

    return NextResponse.json(users[index], { status: 200 });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
