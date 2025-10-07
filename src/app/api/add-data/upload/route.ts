import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/components/ui/auth";
import { getServerSession } from "next-auth";

interface UserUploadRow {
  name: string | null | undefined;
  email: string | null | undefined;
  password: string | null | undefined;
  // Use a string index signature for robust property access
  [key: string]: any;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine file type and parse it
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: UserUploadRow[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json(
        { error: "The uploaded file is empty or invalid" },
        { status: 400 }
      );
    }

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const [index, row] of rows.entries()) {
      const name = (row["name"] || "").toString().trim();
      const email = (row["email"] || "").toString().trim();
      const password = (row["password"] || "").toString().trim();

      if (!name || !email || !password) {
        errors.push(`Row ${index + 2}: Missing name, email, or password`);
        failCount++;
        continue;
      }

      if (password.length < 6) {
        errors.push(`Row ${index + 2}: Password must be at least 6 characters`);
        failCount++;
        continue;
      }

      // Skip if email already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        errors.push(`Row ${index + 2}: Email already exists`);
        failCount++;
        continue;
      }

      try {
        await prisma.docs.create({
          data: { name, email, password, userId: session.user.id },
        });
        successCount++;
      } catch (err) {
        errors.push(`Row ${index + 2}: Failed to create user`);
        failCount++;
      }
    }

    return NextResponse.json(
      {
        message: "File processed",
        summary: {
          successCount,
          failCount,
          errors,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
