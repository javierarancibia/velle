"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CUSTOMER_EMAILS, customerEmailBlocker } from "@/lib/customerEmails";
import type { CustomerEmailKind, OrderRow } from "@/lib/types";

const sentFormat = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
});

// One customer email for one order: a check with the date once sent, and a
// button to send it (or resend it, after a confirm).
export default function CustomerEmailButton({ order, kind }: { order: OrderRow; kind: CustomerEmailKind }) {
  const router = useRouter();
  const email = CUSTOMER_EMAILS.find((e) => e.kind === kind)!;
  const sentAt = order[email.column] as string | null;
  const blocker = customerEmailBlocker(order);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "warning"; text: string } | null>(null);

  async function send() {
    if (sentAt && !window.confirm(`"${email.label}" ya se envió a ${order.customer_email}. ¿Enviarlo otra vez?`)) {
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/send-email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar");
      if (json.warning) setMessage({ tone: "warning", text: json.warning });
      router.refresh();
    } catch (err) {
      setMessage({ tone: "error", text: err instanceof Error ? err.message : "No se pudo enviar" });
    } finally {
      setBusy(false);
    }
  }

  if (blocker) return <span className="text-xs text-muted">{blocker}</span>;

  return (
    <div className="flex flex-col items-start gap-1">
      {sentAt ? (
        <span className="text-xs font-medium text-green-700" title={new Date(sentAt).toLocaleString("es-ES")}>
          ✓ Enviado {sentFormat.format(new Date(sentAt))}
        </span>
      ) : (
        <span className="text-xs text-muted">Sin enviar</span>
      )}
      <button
        type="button"
        onClick={send}
        disabled={busy}
        className={`rounded-md px-3 py-1 text-xs whitespace-nowrap disabled:opacity-40 ${
          sentAt ? "border border-border text-muted hover:text-foreground" : "bg-accent text-white"
        }`}
      >
        {busy ? "Enviando…" : sentAt ? "Reenviar" : "Enviar"}
      </button>
      {message ? (
        <span className={`text-xs ${message.tone === "error" ? "text-red-600" : "text-amber-700"}`}>{message.text}</span>
      ) : null}
    </div>
  );
}
