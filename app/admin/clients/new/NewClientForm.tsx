"use client";

import { useActionState } from "react";
import { createClient, type NewClientState } from "./actions";

type Variant = { id: string; label: string; price: string };

const input = "w-full rounded-md border border-border bg-white px-3 py-2";

export default function NewClientForm({ variants, today }: { variants: Variant[]; today: string }) {
  const [state, action, pending] = useActionState<NewClientState, FormData>(createClient, { error: null, values: {} });
  const v = state.values;

  return (
    // React resets the form after every submit; the key remounts it with the
    // values just sent, so a validation error doesn't wipe what was typed.
    <form key={JSON.stringify(v)} action={action} className="mt-8 space-y-5 text-sm">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span>Nombre *</span>
          <input name="name" required defaultValue={v.name} className={input} />
        </label>
        <label className="space-y-1">
          <span>Email *</span>
          <input name="email" type="email" required defaultValue={v.email} className={input} />
        </label>
        <label className="space-y-1">
          <span>Teléfono</span>
          <input name="phone" type="tel" defaultValue={v.phone} className={input} />
        </label>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-medium">Dirección de envío</legend>
        <label className="space-y-1 sm:col-span-2">
          <span>Calle y número</span>
          <input name="line1" defaultValue={v.line1} className={input} />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span>Piso, puerta… (opcional)</span>
          <input name="line2" defaultValue={v.line2} className={input} />
        </label>
        <label className="space-y-1">
          <span>Código postal</span>
          <input name="postal_code" defaultValue={v.postal_code} className={input} />
        </label>
        <label className="space-y-1">
          <span>Ciudad</span>
          <input name="city" defaultValue={v.city} className={input} />
        </label>
        <label className="space-y-1">
          <span>País</span>
          <select name="country" defaultValue={v.country ?? "ES"} className={input}>
            <option value="ES">España</option>
            <option value="PT">Portugal</option>
          </select>
        </label>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-2 font-medium">Compra</legend>
        <label className="space-y-1">
          <span>Pack *</span>
          <select name="variant_id" required defaultValue={v.variant_id ?? variants[0]?.id} className={input}>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.label} — {variant.price}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span>Importe pagado (€)</span>
          <input name="amount" inputMode="decimal" placeholder="Vacío = precio del pack" defaultValue={v.amount} className={input} />
        </label>
        <label className="space-y-1">
          <span>Fecha de compra *</span>
          <input name="paid_on" type="date" required max={today} defaultValue={v.paid_on ?? today} className={input} />
        </label>
      </fieldset>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="send_confirmation" defaultChecked={v.send_confirmation === "on"} />
        <span>Enviar ahora la confirmación de compra a este cliente</span>
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-900">{state.error}</p>
      ) : null}

      <button type="submit" disabled={pending} className="rounded-md bg-accent px-5 py-2 text-white disabled:opacity-40">
        {pending ? "Guardando…" : "Añadir cliente"}
      </button>
    </form>
  );
}
