import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password)
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 401 }
      );
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    if (process.env.AUTH_SECRET) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.AUTH_SECRET,
        { expiresIn: "7d" }
      );
      return NextResponse.json({ token }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
