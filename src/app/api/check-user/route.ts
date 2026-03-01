import { NextRequest, NextResponse } from "next/server";
import { findUserByPhone } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const user = await findUserByPhone(phoneNumber);

    return NextResponse.json({
      exists: !!user,
    });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
