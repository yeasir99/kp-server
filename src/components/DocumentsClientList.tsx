"use client";

// Import necessary Shadcn/ui components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, User, FileText, Lock } from "lucide-react"; // Icons
import { Document } from "@/app/user/docs/page";

interface DocumentsClientListProps {
  initialDocuments: Document[];
}

export function DocumentsClientList({
  initialDocuments,
}: DocumentsClientListProps) {
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
    <div className="w-full">
      <h2 className="text-2xl font-extrabold tracking-tight mb-6 text-center">
        📚 Your Uploaded Documents
      </h2>

      {initialDocuments.length === 0 ? (
        <Card className="border-dashed bg-gray-50 text-center py-12">
          <CardTitle className="text-xl text-gray-700">
            No Documents Found
          </CardTitle>
          <CardDescription className="mt-2">
            Start by uploading your first batch to see them listed here.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-4">
          {initialDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="hover:shadow-md transition-shadow duration-300 py-4"
            >
              <CardHeader className="flex flex-row items-center justify-between px-4 py-1">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-semibold">
                    {doc.name}
                  </CardTitle>
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(doc.createdAt)}</span>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className=" grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">ID:</span>
                  <span className="text-gray-600 truncate">
                    {doc.id.substring(0, 12)}...
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-600 truncate">{doc.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Password:</span>
                  <span className="text-gray-600 truncate">{doc.password}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
