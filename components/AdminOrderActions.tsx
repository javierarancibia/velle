"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderRow } from "@/lib/types";

export default function AdminOrderActions({ order }: { order: OrderRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  async function callAction(path: string, options?: RequestInit) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(path, { method: "POST", ...options });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handlePrintFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    await callAction(`/api/admin/orders/${order.id}/print-file`, {
      headers: { "content-type": file.type || "application/octet-stream" },
      body: file,
    });
  }

  return (
    <div className="mt-6 border-t border-border pt-6 space-y-4">
      {order.personalization.kind === "pet-portrait" && !order.print_file_url ? (
        <div>
          <label className="block text-sm mb-1">
            Upload stylized print-ready file (required before sending to Gelato)
          </label>
          <input type="file" onChange={handlePrintFileUpload} disabled={busy} className="text-sm" />
          {uploadedFileName ? <p className="text-xs text-muted mt-1">{uploadedFileName}</p> : null}
        </div>
      ) : null}

      {order.print_file_url ? (
        <a
          href={order.print_file_url}
          target="_blank"
          rel="noreferrer"
          className="block text-sm text-accent hover:underline"
        >
          View current print file →
        </a>
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={busy || order.status !== "paid" || !order.print_file_url}
          onClick={() => callAction(`/api/admin/orders/${order.id}/send-to-gelato`)}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm disabled:opacity-40"
        >
          Send to Gelato
        </button>
        <button
          type="button"
          disabled={busy || order.status === "fulfilled"}
          onClick={() => callAction(`/api/admin/orders/${order.id}/mark-fulfilled`)}
          className="px-4 py-2 border border-border rounded-md text-sm disabled:opacity-40"
        >
          Mark fulfilled
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
