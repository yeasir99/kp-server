"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Eye, EyeOff, Copy } from "lucide-react";
import { Document } from "@/app/user/docs/page";

type DocsResponse = {
  items: Document[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function DocumentsTable({
  initialItems,
  total,
  page,
  limit,
  apiPath = "/api/docs",
}: {
  initialItems: Document[];
  total: number;
  page: number;
  limit: number;
  apiPath?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [items, setItems] = useState<Document[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(sp.get("q") || "");
  const [pageSize, setPageSize] = useState(() => {
    const l = Number(sp.get("limit") || limit);
    return Number.isFinite(l) && l > 0 ? l : 20;
  });
  const [current, setCurrent] = useState(() => {
    const p = Number(sp.get("page") || page);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  const pages = useMemo(() => Math.max(Math.ceil(total / limit), 1), [total, limit]);

  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function toggleReveal(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function copyPwd(id: string, pwd: string) {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopiedId(id);
      setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1200);
    } catch {}
  }

  function statusClass(status: string) {
    switch (status) {
      case "CREATED":
        return "bg-green-100 text-green-700";
      case "PHONE_VERIFICATION":
        return "bg-amber-100 text-amber-800";
      case "EMAIL_VERIFICATION":
        return "bg-blue-100 text-blue-700";
      case "NOT_TOUCH":
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  useEffect(() => {
    // keep URL in sync
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(current));
    params.set("limit", String(pageSize));
    if (query) params.set("q", query); else params.delete("q");
    router.replace(`?${params.toString()}`);
  }, [current, pageSize, query]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    async function fetchData() {
      if (mounted) setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(current));
        params.set("limit", String(pageSize));
        if (query) params.set("q", query);
        const res = await fetch(`${apiPath}?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data: DocsResponse = await res.json();
        if (mounted) setItems(data.items);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          // Silently ignore network aborts; log others for debugging
          // console.error("Docs fetch error", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [current, pageSize, query, apiPath]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 gap-2">
        <Input
          placeholder="Search name, email, phone..."
          value={query}
          onChange={(e) => {
            setCurrent(1);
            setQuery(e.target.value);
          }}
          className="h-9 max-w-sm"
        />
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border px-2 text-sm bg-white"
            value={pageSize}
            onChange={(e) => {
              setCurrent(1);
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <div className="w-full overflow-x-auto">
        <table className="w-full text-sm min-w-[1040px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">Name</th>
              <th className="text-left font-medium px-3 py-2">Email</th>
              <th className="text-left font-medium px-3 py-2">Password</th>
              <th className="text-left font-medium px-3 py-2">Country</th>
              <th className="text-left font-medium px-3 py-2">City</th>
              <th className="text-left font-medium px-3 py-2">Post Code</th>
              <th className="text-left font-medium px-3 py-2">DOB</th>
              <th className="text-left font-medium px-3 py-2">Phone</th>
              <th className="text-left font-medium px-3 py-2">Status</th>
              <th className="text-left font-medium px-3 py-2 whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-4 text-center text-gray-500" colSpan={10}>
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={10}>
                  No documents
                </td>
              </tr>
            ) : (
              items.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-3 py-2 font-medium text-gray-900 truncate max-w-[220px] align-middle">{d.name}</td>
                  <td className="px-3 py-2 text-gray-700 truncate max-w-[240px] align-middle">{d.email}</td>
                  <td className="px-3 py-2 text-gray-700 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="font-mono select-all">
                        {revealed[d.id]
                          ? d.password
                          : "\u2022".repeat(Math.min(d.password?.length || 8, 8))}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleReveal(d.id)}
                        aria-label={revealed[d.id] ? "Hide password" : "Show password"}
                      >
                        {revealed[d.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyPwd(d.id, d.password)}
                        aria-label="Copy password"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {copiedId === d.id && (
                        <span className="text-[11px] text-green-600">Copied</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-700 truncate max-w-[140px] align-middle">{d.country}</td>
                  <td className="px-3 py-2 text-gray-700 truncate max-w-[140px] align-middle">{d.city}</td>
                  <td className="px-3 py-2 text-gray-700 align-middle">{d.postCode}</td>
                  <td className="px-3 py-2 text-gray-700 align-middle">{formatDate(d.dob)}</td>
                  <td className="px-3 py-2 text-gray-700 truncate max-w-[160px] align-middle">{d.phone}</td>
                  <td className="px-3 py-2 align-middle">
                    {d.status ? (
                      <span className={`${statusClass(String(d.status))} inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium`}>{String(d.status)}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-500 align-middle whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDateTime(d.createdAt)}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </Card>

      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="text-gray-600">
          Showing {(current - 1) * pageSize + (items.length ? 1 : 0)}-
          {(current - 1) * pageSize + items.length} of {total}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={current <= 1}
            onClick={() => setCurrent((p) => Math.max(p - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={items.length < pageSize}
            onClick={() => setCurrent((p) => p + 1)}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
