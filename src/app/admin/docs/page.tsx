import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import { prisma } from "@/lib/prisma";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DocumentsTable } from "@/components/DocumentsTable";

interface Document {
  id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  state: string;
  city: string;
  postCode: string;
  address: string;
  dob: Date;
  phone: string;
  status?: any;
  createdAt: Date;
}

export default async function AdminDocsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>Login required.</AlertDescription>
      </Alert>
    );
  }

  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!me || me.role !== "ROOT") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Forbidden</AlertTitle>
        <AlertDescription>Admin privileges required.</AlertDescription>
      </Alert>
    );
  }

  let documents: Document[] = [];
  let total = 0;
  let error: string | null = null;

  const sp = (await searchParams) || {};
  const page = Math.max(parseInt(String(sp.page || "1"), 10), 1);
  const limit = Math.min(
    Math.max(parseInt(String(sp.limit || "20"), 10), 1),
    100
  );
  const q = (String(sp.q || "")).trim();

  try {
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

    [documents, total] = (await Promise.all([
      prisma.docs.findMany({
        where,
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
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.docs.count({ where }),
    ])) as [Document[], number];
  } catch (err) {
    console.error("Error fetching admin documents:", err);
    error = "Failed to load documents due to a server error.";
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Data Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <DocumentsTable
      initialItems={documents}
      total={total}
      page={page}
      limit={limit}
      apiPath="/api/admin/docs"
    />
  );
}
