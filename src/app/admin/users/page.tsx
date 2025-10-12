import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminUsersPage() {
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

  // Fetch all users (excluding password)
  const users = await prisma.user.findMany({
    where: {
      NOT: { role: "ROOT" },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Users</h1>
      <Card>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left font-medium px-3 py-2">Name</th>
                <th className="text-left font-medium px-3 py-2">Email</th>
                <th className="text-left font-medium px-3 py-2">Role</th>
                <th className="text-left font-medium px-3 py-2 whitespace-nowrap">Created</th>
                <th className="text-left font-medium px-3 py-2">Controls</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>
                    No users
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-3 py-2 align-middle font-medium text-gray-900 truncate max-w-[240px]">
                      {u.name || "—"}
                    </td>
                    <td className="px-3 py-2 align-middle text-gray-700 truncate max-w-[280px]">
                      {u.email || "—"}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 uppercase tracking-wide">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle text-gray-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(u.createdAt)}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <Link href={`/admin/users/${u.id}`}>
                        <Button size="sm" variant="outline" className="h-8 cursor-pointer">
                          Controls
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
