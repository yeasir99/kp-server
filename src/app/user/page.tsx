import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="text-center text-sm text-gray-600">
        Please sign in to view your dashboard.
      </div>
    );
  }

  const userId = session.user.id;

  const [nonTouchCount, createdCount] = await Promise.all([
    prisma.docs.count({ where: { userId, status: "NOT_TOUCH" as any } }),
    prisma.docs.count({ where: { userId, status: "CREATED" as any } }),
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="text-sm text-gray-500">Non-Touch Docs</div>
          <div className="mt-1 text-3xl font-semibold">{nonTouchCount}</div>
          <div className="mt-2 text-xs text-gray-500">
            Documents not processed yet
          </div>
          <div className="mt-3 text-xs">
            <Link href="/user/docs" className="text-blue-600 hover:underline">
              View all docs
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="text-sm text-gray-500">Created Docs</div>
          <div className="mt-1 text-3xl font-semibold">{createdCount}</div>
          <div className="mt-2 text-xs text-gray-500">Successfully created</div>
          <div className="mt-3 text-xs">
            <Link href="/user/docs" className="text-blue-600 hover:underline">
              View all docs
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
