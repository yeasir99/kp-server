import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!me || me.role !== "ROOT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const password: string = body?.password || "";
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: params.id }, data: { password: hashed } });

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    console.error("Update user password error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

