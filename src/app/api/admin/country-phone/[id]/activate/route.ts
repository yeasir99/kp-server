import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";

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

    const id = params.id;
    // Ensure exists
    const exists = await prisma.countryPhone.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.countryPhone.updateMany({ data: { current: false }, where: { current: true } }),
      prisma.countryPhone.update({ where: { id }, data: { current: true } }),
    ]);

    return NextResponse.json({ id, message: "Activated" });
  } catch (err) {
    console.error("Activate country error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
