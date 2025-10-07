import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yor are not authorized" },
        { status: 400 }
      );
    }
    const contentType = req.headers.get("content-type");

    let name = "";
    let email = "";
    let password = "";

    if (contentType?.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name") as string;
      email = formData.get("email") as string;
      password = formData.get("password") as string;
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.docs.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = await prisma.docs.create({
      data: {
        name,
        email,
        password,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Document Added Successfully",
    });
  } catch (error) {
    console.error("Error Adding Document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
