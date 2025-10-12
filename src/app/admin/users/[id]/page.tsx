import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import { prisma } from "@/lib/prisma";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserControls } from "@/components/admin/UserControls";

export default async function AdminUserControlsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>You must be logged in as admin.</AlertDescription>
      </Alert>
    );
  }

  // Ensure only ROOT/admin can access controls
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

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>User does not exist.</AlertDescription>
      </Alert>
    );
  }

  const docsCount = await prisma.docs.count({ where: { userId: user.id } });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Name:</span> {user.name || "—"}</div>
          <div><span className="font-medium">Email:</span> {user.email || "—"}</div>
          <div><span className="font-medium">Role:</span> {user.role}</div>
          <div><span className="font-medium">Created:</span> {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(user.createdAt)}</div>
          <div className="md:col-span-2"><span className="font-medium">Total Documents:</span> {docsCount}</div>
        </CardContent>
      </Card>

      <UserControls userId={user.id} />
    </div>
  );
}

