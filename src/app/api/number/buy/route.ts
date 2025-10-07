import { NextResponse } from "next/server";
import { buyNumber } from "@/lib/buyNumber";

export async function POST(req: Request) {
  try {
    const data = buyNumber();
    return NextResponse.json(
      { message: "User created successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADDED_DATA_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
