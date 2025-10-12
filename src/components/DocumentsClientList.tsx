"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Calendar,
  User,
  FileText,
  Lock,
  MapPin,
  Phone,
  Globe,
  Flag,
} from "lucide-react";
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

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold tracking-tight mb-4 text-center">
        Your Documents
      </h2>

      {initialDocuments.length === 0 ? (
        <Card className="border-dashed bg-gray-50 text-center py-8">
          <CardTitle className="text-lg text-gray-700">No Documents</CardTitle>
          <CardDescription className="mt-1 text-sm">
            Upload your first records to see them here.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-3">
          {initialDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="hover:shadow-sm transition-shadow duration-200 rounded-lg overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium truncate">
                    {doc.name}
                  </CardTitle>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  {doc.status && (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full bg-gray-100 text-gray-700">
                      {String(doc.status)}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDateTime(doc.createdAt)}</span>
                  </div>
                </div>
              </CardHeader>
              <Separator className="opacity-50" />
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-[13px] px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">ID: {doc.id.substring(0, 10)}...</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.email}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Lock className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.password}</span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.country}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Flag className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.state}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.city}</span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.postCode}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 md:col-span-1 lg:col-span-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.address}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">DOB: {formatDate(doc.dob)}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-gray-600 truncate">{doc.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

