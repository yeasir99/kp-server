import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logout from "../Logout";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/poster">
          <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href="/user/add-docs">
            <Button className="cursor-pointer">Add Docs</Button>
          </Link>
          <Link href="/user/docs">
            <Button className="cursor-pointer">Docs</Button>
          </Link>
          <Logout className="cursor-pointer" />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
