import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";

export async function POST(req: Request) {
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
    const countryName: string = (body?.countryName || "").trim();
    const countryCode: string = (body?.countryCode || "").trim();
    const apiCountryName: string = (body?.apiCountryName || "").trim();

    const missing: string[] = [];
    if (!countryName) missing.push("countryName");
    if (!countryCode) missing.push("countryCode");
    if (!apiCountryName) missing.push("apiCountryName");
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const created = await (prisma as any).countryPhone.create({
      data: { countryName, countryCode, apiCountryName },
      select: {
        id: true,
        countryName: true,
        countryCode: true,
        apiCountryName: true,
        current: true,
        createdAt: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Create CountryPhone error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
