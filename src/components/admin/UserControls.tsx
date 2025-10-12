"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function UserControls({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd || !confirm) {
      toast({ variant: "destructive", title: "Missing input", description: "Enter and confirm password" });
      return;
    }
    if (pwd !== confirm) {
      toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match" });
      return;
    }
    if (pwd.length < 6) {
      toast({ variant: "destructive", title: "Too short", description: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      toast({ title: "Password updated" });
      setPwd("");
      setConfirm("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update failed", description: err.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            type="password"
            placeholder="New password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="md:col-span-1">
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

