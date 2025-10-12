import { NextResponse } from "next/server";
import { buyNumber, ResType } from "@/lib/buyNumber";

export async function GET(req: Request) {
  try {
    const responseData: ResType = await buyNumber();
    if (!responseData.status) {
      return NextResponse.json(
        { error: "Failed to buy number" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Number purchased successfully",
        data: responseData.data,
      },
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
