import { NextRequest, NextResponse } from "next/server";
import { checkSMS } from "@/lib/checkMessage";

type tParams = Promise<{ id: string }>;

export async function GET(_: NextRequest, { params }: { params: tParams }) {
  try {
    const { id } = await params;
    const data = checkSMS(id);
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
