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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fromDate: user.fromDate,
      toDate: user.toDate,
      status: user.status,
    });
  } catch (error) {
    console.error("Check subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
