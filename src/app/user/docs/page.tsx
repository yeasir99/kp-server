// components/DocumentsTable.tsx
// THIS IS A SERVER COMPONENT

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/components/ui/auth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
// 👈 Changed import to the new list component
import { DocumentsClientList } from "@/components/DocumentsClientList";

// Define the Document type
export interface Document {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export default async function DocumentsTable() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unauthorized Access</AlertTitle>
        <AlertDescription>
          You must be logged in to view your documents.
        </AlertDescription>
      </Alert>
    );
  }

  let documents: Document[] = [];
  let error: string | null = null;

  try {
    documents = (await prisma.docs.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as Document[];
  } catch (err) {
    console.error("Error fetching documents on server:", err);
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

  // Pass the fetched data directly to the client component
  // 👈 Using the new list component
  return <DocumentsClientList initialDocuments={documents} />;
}
