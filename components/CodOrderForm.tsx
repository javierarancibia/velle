"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductVariantRow } from "@/lib/types";

interface Props {
  variant: ProductVariantRow;
  onClose: () => void;
  onPayByCard: () => void;
}

const FIELDS = [
  { name: "name", label: "Nombre y apellidos", autoComplete: "name", required: true },
  { name: "phone", label: "Teléfono (WhatsApp)", autoComplete: "tel", type: "tel", inputMode: "tel", required: true },
  { name: "email", label: "Email", autoComplete: "email", type: "email", inputMode: "email", required: true },
  { name: "line1", label: "Dirección (calle, número, piso)", autoComplete: "address-line1", required: true },
  { name: "line2", label: "Más datos de la dirección (opcional)", autoComplete: "address-line2", required: false },
  { name: "postalCode", label: "Código postal", autoComplete: "postal-code", inputMode: "numeric", required: true, half: true },
  { name: "city", label: "Ciudad", autoComplete: "address-level2", required: true, half: true },
  { name: "province", label: "Provincia", autoComplete: "address-level1", required: false },
] as const;

const FIELD_ERRORS: Record<string, string> = {
  name: "Escribe tu nombre y apellidos.",
  phone: "Revisa el teléfono: 9 cifras, por ejemplo 612 345 678.",
  email: "Revisa el email.",
  line1: "Escribe tu dirección.",
  postalCode: "Revisa el código postal (5 cifras).",
  city: "Escribe tu ciudad.",
};

// Cash-on-delivery order form (bottom sheet on phones, dialog on desktop).
// Spain only. Card payment stays available through the link at the bottom.
export default function CodOrderForm({ variant, onClose, onPayByCard }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const price = formatPrice(variant.price_cents, variant.currency, "es-ES");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("input")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/cod", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, variantId: variant.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const fieldErrors = Object.keys(json?.error?.fieldErrors ?? {})
          .map((k) => FIELD_ERRORS[k])
          .filter(Boolean);
        throw fieldErrors.length ? fieldErrors : ["No se pudo enviar el pedido. Inténtalo de nuevo."];
      }
      router.push(`/checkout/success?order=${encodeURIComponent(json.orderNumber ?? "")}`);
    } catch (err) {
      setErrors(Array.isArray(err) ? err : ["No se pudo enviar el pedido. Revisa tu conexión e inténtalo de nuevo."]);
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cod-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-background px-5 pt-5 pb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="cod-title" className="text-xl font-medium">
              Paga al recibir
            </h2>
            <p className="mt-1 text-sm text-muted">
              {variant.label} · <span className="font-medium text-foreground">{price}</span> · Envío gratis
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="-mr-1 p-1 text-2xl leading-none text-muted">
            ×
          </button>
        </div>

        <p className="mt-4 rounded-lg bg-[#f3ece1] px-4 py-3 text-sm leading-relaxed">
          No pagas nada ahora. Te escribimos por WhatsApp para confirmar y pagas <strong>{price}</strong> al repartidor
          cuando lo recibas.
        </p>

        <form onSubmit={submit} className="mt-5 grid grid-cols-2 gap-3" noValidate={false}>
          {FIELDS.map((f) => (
            <label key={f.name} className={`${"half" in f && f.half ? "col-span-1" : "col-span-2"} block text-sm`}>
              <span className="text-muted">{f.label}</span>
              <input
                name={f.name}
                required={f.required}
                autoComplete={f.autoComplete}
                type={"type" in f ? f.type : "text"}
                inputMode={"inputMode" in f ? f.inputMode : undefined}
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-base"
              />
            </label>
          ))}
          {/* Honeypot: hidden from people, bots fill it. */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          {errors.length ? (
            <div className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="col-span-2 mt-2 w-full rounded-full bg-accent py-4 text-sm font-medium uppercase tracking-wide text-white disabled:opacity-50"
          >
            {submitting ? "Enviando…" : `Hacer pedido • ${price}`}
          </button>
          <p className="col-span-2 text-center text-xs text-muted">
            Envíos a toda España. Al pedir aceptas las{" "}
            <Link href="/condiciones" className="underline underline-offset-2">
              condiciones de venta
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={onPayByCard}
            className="col-span-2 text-center text-sm text-muted underline underline-offset-2"
          >
            Prefiero pagar ahora con tarjeta o Bizum
          </button>
        </form>
      </div>
    </div>
  );
}
