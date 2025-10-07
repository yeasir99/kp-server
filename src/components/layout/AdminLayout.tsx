"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "../Logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

const navLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "User List", href: "/admin/users" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 space-y-4 hidden md:flex flex-col justify-between min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
          <nav className="space-y-2 flex flex-col justify-center items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-md font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-3 overflow-y-auto">
        <div className="flex justify-end items-center space-x-2 mb-2">
          <Link href="/admin/users/create">
            <Button className="cursor-pointer bg-gray-700" role="button">
              Create User
            </Button>
          </Link>
          <div>
            <Logout className="cursor-pointer" />
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <DropdownMenuItem>{link.name}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
