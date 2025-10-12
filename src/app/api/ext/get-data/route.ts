import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { msg: "You are Not Authorized" },
        { status: 400 }
      );
    }
    const userData: any = jwt.decode(token);
    if (!userData.id) {
      return NextResponse.json(
        { msg: "You are Not Authorized" },
        { status: 400 }
      );
    }
    const data = await prisma.docs.findMany({
      where: {
        userId: userData.id,
        status: "NOT_TOUCH",
      },
      select: {
        name: true,
        email: true,
        password: true,
        country: true,
        state: true,
        city: true,
        postCode: true,
        address: true,
        dob: true,
        phone: true,
      },
    });
    console.log(data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
