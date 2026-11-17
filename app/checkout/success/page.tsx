import { getOrderByOrderNumber, getVariantById } from "@/lib/db";
import { displayPhone, whatsAppLink } from "@/lib/emails/codOrder";
import { euros } from "@/lib/emails/shared";
import TrackPurchase from "@/components/TrackPurchase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gracias por tu pedido — Velle",
};

// Velle's own WhatsApp number with country code, digits only (e.g.
// 34612345678). When set, cash-on-delivery customers get a button to confirm
// their order themselves straight away.
const VELLE_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || null;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByOrderNumber(orderNumber) : null;

  // The webhook that flips an order to "paid" can lag slightly behind
  // Stripe's redirect back here, so a still-"pending_payment" order on this
  // page isn't necessarily an error — but we only fire the Meta Purchase
  // event (and only show a firm confirmation) once it's actually paid.
  // Cash-on-delivery orders count as a purchase as soon as they're placed.
  const isPaid = order?.status === "paid";
  const isCod = order?.payment_method === "cod" && order.status === "cod_pending";

  const track =
    (isPaid || isCod) && order && order.amount_total_cents !== null && order.currency ? (
      <TrackPurchase
        orderId={order.id}
        orderNumber={order.order_number}
        valueCents={order.amount_total_cents}
        currency={order.currency}
      />
    ) : null;

  if (isCod && order) {
    const variant = await getVariantById(order.variant_id);
    const total = euros(order.amount_total_cents, order.currency);
    const confirmLink = VELLE_WHATSAPP
      ? whatsAppLink(
          VELLE_WHATSAPP,
          `¡Hola! Confirmo mi pedido ${order.order_number} (${variant?.label ?? "cuadro"}, ${total} a pagar al recibir).`
        )
      : null;
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-3xl font-medium">¡Pedido recibido!</h1>
        <p className="mt-4 text-lg leading-relaxed">
          Te escribiremos por WhatsApp al <strong>{displayPhone(order.customer_phone)}</strong> para confirmar tu
          pedido. En cuanto nos respondas, lo enviamos y llega en 24–72 h. Pagas <strong>{total}</strong> al
          recibirlo.
        </p>
        {confirmLink ? (
          <>
            <a
              href={confirmLink}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-medium text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z" />
              </svg>
              Confirmar ahora por WhatsApp
            </a>
            <p className="mt-3 text-sm text-muted">Si lo confirmas tú ahora, lo enviamos antes.</p>
          </>
        ) : null}
        <p className="mt-8 text-sm text-muted">
          Te hemos enviado el resumen a <span className="text-foreground">{order.customer_email}</span>. ¿Alguna duda?
          Escríbenos a <span className="font-medium text-foreground">info@velle.es</span>.
        </p>
        {track}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">¡Gracias por tu pedido!</h1>
      <p className="mt-4 text-muted">
        {isPaid && order
          ? `Tu pedido ${order.order_number} está confirmado. Lo preparamos y te llega en 24–72 h.`
          : "Estamos confirmando tu pago. Puede tardar unos segundos; recarga la página en un momento."}
      </p>
      <p className="mt-3 text-sm text-muted">
        ¿Alguna duda? Escríbenos a <span className="font-medium text-foreground">info@velle.es</span>.
      </p>
      {track}
    </div>
  );
}
