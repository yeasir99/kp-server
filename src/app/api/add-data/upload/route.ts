import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import * as XLSX from "xlsx";

type RowIn = Record<string, any>;

function parseDobToDate(dob: unknown): { date?: Date; error?: string } {
  if (dob === null || dob === undefined || dob === "") {
    return { error: "dob is empty" };
  }

  let birthDate: Date | undefined;

  if (typeof dob === "number") {
    const parsed = XLSX.SSF.parse_date_code(dob);
    if (!parsed || !parsed.y || !parsed.m || !parsed.d) {
      return { error: "Invalid Excel date value" };
    }
    birthDate = new Date(parsed.y, parsed.m - 1, parsed.d);
  } else if (Object.prototype.toString.call(dob) === "[object Date]") {
    const d = dob as Date;
    if (isNaN(d.getTime())) return { error: "Invalid date" };
    birthDate = d;
  } else if (typeof dob === "string") {
    const str = dob.trim();
    const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      return { error: "Invalid date format. Use MM/DD/YYYY" };
    }
    const mm = parseInt(match[1], 10) - 1;
    const dd = parseInt(match[2], 10);
    const yyyy = parseInt(match[3], 10);
    birthDate = new Date(yyyy, mm, dd);
  } else {
    return { error: "Unsupported date value" };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  if (age < 18) return { error: "Must be at least 18 years old" };
  return { date: birthDate };
}

function normalizeKeys(row: RowIn): RowIn {
  const out: RowIn = {};
  for (const [k, v] of Object.entries(row)) {
    const nk = k.toLowerCase().replace(/\s+/g, "");
    out[nk] = v;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yor are not authorized" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Use field name 'file'." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse workbook with cell dates preserved as JS Date objects
    const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      return NextResponse.json(
        { error: "No sheet found in the uploaded file" },
        { status: 400 }
      );
    }

    const rows = XLSX.utils.sheet_to_json<RowIn>(sheet, {
      defval: "",
      raw: true,
    });
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No rows found in the uploaded file" },
        { status: 400 }
      );
    }

    const required = [
      "name",
      "email",
      "password",
      "country",
      "state",
      "city",
      "postcode",
      "address",
      "dob",
      "phone",
    ];

    const toCreate: any[] = [];
    const errors: { row: number; error: string }[] = [];

    rows.forEach((r, idx) => {
      const row = normalizeKeys(r);

      // validate missing
      const missing = required.filter(
        (k) => !row[k] || String(row[k]).trim() === ""
      );
      if (missing.length) {
        errors.push({ row: idx + 2, error: `Missing: ${missing.join(", ")}` });
        return;
      }

      const { date, error } = parseDobToDate(row["dob"]);
      if (error || !date) {
        errors.push({ row: idx + 2, error: `DOB: ${error}` });
        return;
      }

      toCreate.push({
        name: String(row["name"]),
        email: String(row["email"]).toLowerCase(),
        password: String(row["password"]),
        country: String(row["country"]),
        state: String(row["state"]),
        city: String(row["city"]),
        postCode: String(row["postcode"]),
        address: String(row["address"]),
        dob: date,
        phone: String(row["phone"]),
        userId: session.user.id,
      });
    });

    if (toCreate.length === 0) {
      return NextResponse.json(
        { error: "No valid rows to import", details: errors },
        { status: 400 }
      );
    }

    // create many; skip duplicates by unique email constraint
    const result = await prisma.docs.createMany({
      data: toCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Upload processed",
      inserted: result.count,
      rejected: errors.length,
      errors,
    });
  } catch (err) {
    console.error("Upload error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
