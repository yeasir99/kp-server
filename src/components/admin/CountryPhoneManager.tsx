"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

type Country = {
  id: string;
  countryName: string;
  countryCode: string;
  apiCountryName: string;
  current: boolean;
  createdAt: string | Date;
};

export function CountryPhoneManager({
  initialCountries,
}: {
  initialCountries: Country[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [countries, setCountries] = useState(initialCountries);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    countryName: "",
    countryCode: "",
    apiCountryName: "",
  });

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.countryName || !form.countryCode || !form.apiCountryName) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "All fields are required",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/country-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // update local state immediately
      setCountries((prev) => [data as any, ...prev]);
      toast({ title: "Country added" });
      setForm({ countryName: "", countryCode: "", apiCountryName: "" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add",
      });
    } finally {
      setLoading(false);
    }
  };

  const onActivate = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/country-phone/${id}/activate`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // mark only selected as current
      setCountries((prev) => prev.map((c) => ({ ...c, current: c.id === id })));
      toast({ title: "Country activated" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to activate",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date | string): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Country for Phone Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onCreate}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <Input
              placeholder="Country Name"
              value={form.countryName}
              onChange={(e) =>
                setForm((f) => ({ ...f, countryName: e.target.value }))
              }
              required
            />
            <Input
              placeholder="Country Code (e.g., GB)"
              value={form.countryCode}
              onChange={(e) =>
                setForm((f) => ({ ...f, countryCode: e.target.value }))
              }
              required
            />
            <Input
              placeholder="API Country Name (slug)"
              value={form.apiCountryName}
              onChange={(e) =>
                setForm((f) => ({ ...f, apiCountryName: e.target.value }))
              }
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="md:col-span-1 h-10"
            >
              {loading ? "Saving..." : "Add Country"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-medium px-3 py-2">Country</th>
                  <th className="text-left font-medium px-3 py-2">Code</th>
                  <th className="text-left font-medium px-3 py-2">API Name</th>
                  <th className="text-left font-medium px-3 py-2">Current</th>
                  <th className="text-left font-medium px-3 py-2 whitespace-nowrap">
                    Created
                  </th>
                  <th className="text-left font-medium px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {countries.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-gray-500"
                      colSpan={6}
                    >
                      No countries added yet
                    </td>
                  </tr>
                ) : (
                  countries.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-2 align-middle">
                        {c.countryName}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {c.countryCode}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {c.apiCountryName}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {c.current ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-green-100 text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-middle text-gray-500 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDateTime(c.createdAt)}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {c.current ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="h-8"
                          >
                            Current
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 cursor-pointer"
                            onClick={() => onActivate(c.id)}
                          >
                            Activate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
