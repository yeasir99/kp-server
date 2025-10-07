"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function UploadPage() {
  const { toast } = useToast();

  // form upload states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // file upload state
  const [file, setFile] = useState<File | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out all fields.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/add-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to upload user.",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "User created successfully.",
      });

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an Excel or CSV file to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/add-data/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: errorData.error || "Something went wrong.",
        });
        return;
      }

      toast({
        title: "File uploaded!",
        description: "Your document has been processed successfully.",
      });

      setFile(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "Something went wrong during upload.",
      });
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Form Upload</TabsTrigger>
              <TabsTrigger value="excel">Excel Upload</TabsTrigger>
            </TabsList>

            {/* --- Form Upload Tab --- */}
            <TabsContent value="form">
              <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Doc"}
                </Button>
              </form>
            </TabsContent>

            {/* --- Excel Upload Tab --- */}
            <TabsContent value="excel">
              <form onSubmit={handleFileUpload} className="space-y-4 mt-4">
                <Input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button type="submit" disabled={!file} className="w-full">
                  Upload File
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
