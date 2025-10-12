import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!me || me.role !== "ROOT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limitRaw = parseInt(searchParams.get("limit") || "20", 10);
    const limit = Math.min(Math.max(limitRaw, 1), 100);
    const q = (searchParams.get("q") || "").trim();
    const sort = (searchParams.get("sort") || "createdAt:desc").trim();

    const [sortField, sortDir] = sort.split(":");
    const orderBy: any = {};
    orderBy[sortField || "createdAt"] = (sortDir === "asc" ? "asc" : "desc");

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { state: { contains: q, mode: "insensitive" } },
        { country: { contains: q, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.docs.findMany({
        where,
        orderBy,
        take: limit,
        skip,
        select: {
          id: true,
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
          status: true,
          userId: true,
          createdAt: true,
        },
      }),
      prisma.docs.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      pages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (err) {
    console.error("Admin docs list error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

