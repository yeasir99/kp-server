import { NextRequest, NextResponse } from "next/server";
import { reUseNumber } from "@/lib/reuseNumber";

type tParams = Promise<{ phone: string }>;

export async function GET(_: NextRequest, { params }: { params: tParams }) {
  try {
    const { phone } = await params;
    if (!phone) {
      return NextResponse.json({ error: "Phone missing" }, { status: 400 });
    }

    const data = reUseNumber(phone);
    return NextResponse.json(
      { message: "Available for Re-use", data },
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
