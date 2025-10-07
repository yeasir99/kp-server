import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { authOptions } from "@/components/ui/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all 'docs' associated with the current user's ID
    const documents = await prisma.docs.findMany({
      where: {
        userId: session.user.id,
      },
      // Select only the fields you want to display or use
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true, // Assuming you have a createdAt field
      },
      orderBy: {
        createdAt: "desc", // Show newest documents first
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
