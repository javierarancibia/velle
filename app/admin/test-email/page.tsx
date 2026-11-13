import { redirect } from "next/navigation";
import { sendTestOrderConfirmation } from "@/lib/notify";

// Behind the /admin password (middleware.ts), including the form's POST.
// Sends the customer order confirmation with sample data to any address.

export const dynamic = "force-dynamic";

export const metadata = { title: "Email de prueba", robots: { index: false, follow: false } };

async function sendTest(formData: FormData) {
  "use server";
  const to = String(formData.get("to") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    redirect(`/admin/test-email?error=${encodeURIComponent("Email no válido")}&to=${encodeURIComponent(to)}`);
  }
  let result: string;
  try {
    const id = await sendTestOrderConfirmation(to);
    result = `sent=${encodeURIComponent(to)}&id=${encodeURIComponent(id)}`;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    result = `error=${encodeURIComponent(message)}&to=${encodeURIComponent(to)}`;
  }
  redirect(`/admin/test-email?${result}`);
}

export default async function TestEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; id?: string; error?: string; to?: string }>;
}) {
  const { sent, id, error, to } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-medium">Email de prueba</h1>
      <p className="mt-2 text-sm text-muted">
        Envía la confirmación de pedido (con datos de ejemplo) a cualquier dirección.
      </p>

      <form action={sendTest} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="to"
          required
          defaultValue={to ?? sent ?? ""}
          placeholder="tu@hotmail.com"
          className="flex-1 rounded-md border border-border bg-white px-3 py-2"
        />
        <button type="submit" className="rounded-md bg-accent px-5 py-2 text-white">
          Enviar
        </button>
      </form>

      {sent ? (
        <p className="mt-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
          Enviado a <strong>{sent}</strong>. Resend lo aceptó{id ? ` (id ${id})` : ""}; mira su estado en Resend → Emails.
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          No se pudo enviar: {error}
        </p>
      ) : null}
    </div>
  );
}
