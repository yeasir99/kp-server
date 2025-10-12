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
    let country = "";
    let state = "";
    let city = "";
    let postCode = "";
    let address = "";
    let dob = "";
    let phone = "";

    if (contentType?.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
      country = body.country ?? "";
      state = body.state ?? "";
      city = body.city ?? "";
      postCode = body.postCode ?? "";
      address = body.address ?? "";
      dob = body.dob ?? "";
      phone = body.phone ?? "";
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      password = (formData.get("password") as string) || "";
      country = (formData.get("country") as string) || "";
      state = (formData.get("state") as string) || "";
      city = (formData.get("city") as string) || "";
      postCode = (formData.get("postCode") as string) || "";
      address = (formData.get("address") as string) || "";
      dob = (formData.get("dob") as string) || "";
      phone = (formData.get("phone") as string) || "";
    }

    const missing = [
      { key: "name", val: name },
      { key: "email", val: email },
      { key: "password", val: password },
      { key: "country", val: country },
      { key: "state", val: state },
      { key: "city", val: city },
      { key: "postCode", val: postCode },
      { key: "address", val: address },
      { key: "dob", val: dob },
      { key: "phone", val: phone },
    ].filter((f) => !f.val || String(f.val).trim() === "");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.map((m) => m.key).join(", ")}` },
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

    // Validate DOB format MM/DD/YYYY and age >= 18
    const dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
    if (!dobPattern.test(dob)) {
      return NextResponse.json(
        { error: "Invalid date format. Use MM/DD/YYYY (e.g., 10/25/2000)" },
        { status: 400 }
      );
    }
    const match = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)!;
    const mm = parseInt(match[1], 10) - 1;
    const dd = parseInt(match[2], 10);
    const yyyy = parseInt(match[3], 10);
    const birthDate = new Date(yyyy, mm, dd);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 18) {
      return NextResponse.json(
        { error: "You must be at least 18 years old" },
        { status: 400 }
      );
    }

    const data: any = {
      name,
      email,
      password,
      country,
      state,
      city,
      postCode,
      address,
      dob: birthDate,
      phone,
      userId: session.user.id,
    };

    const newUser = await prisma.docs.create({ data });

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
