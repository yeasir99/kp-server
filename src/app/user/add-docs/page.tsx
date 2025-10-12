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
  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // file upload state
  const [file, setFile] = useState<File | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !country ||
      !stateVal ||
      !city ||
      !postCode ||
      !address ||
      !dob ||
      !phone
    ) {
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

    // Validate DOB format MM/DD/YYYY and age >= 18
    const dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
    if (!dobPattern.test(dob)) {
      toast({
        variant: "destructive",
        title: "Invalid date format",
        description: "Use MM/DD/YYYY (e.g., 10/25/2000)",
      });
      return;
    }

    const [, mmStr, ddStr, yyyyStr] = dob.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    )!;
    const mm = parseInt(mmStr, 10) - 1;
    const dd = parseInt(ddStr, 10);
    const yyyy = parseInt(yyyyStr, 10);
    const birthDate = new Date(yyyy, mm, dd);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      toast({
        variant: "destructive",
        title: "Age restriction",
        description: "You must be at least 18 years old.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/add-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          country,
          state: stateVal,
          city,
          postCode,
          address,
          dob,
          phone,
          status: "Free",
        }),
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
      setCountry("");
      setStateVal("");
      setCity("");
      setPostCode("");
      setAddress("");
      setDob("");
      setPhone("");
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
    <main className="min-h-screen bg-gray-50 flex justify-center items-start py-10">
      <Card className="w-full max-w-2xl shadow-md">
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
                  required
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="State"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Post Code"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Input
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <Input
                  placeholder="MM/DD/YYYY"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  pattern="^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$"
                  title="Enter date as MM/DD/YYYY (e.g., 10/25/2000)"
                  required
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
