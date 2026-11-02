import Link from "next/link";
import { PRODUCT_PATH } from "@/lib/cuadroJesus";

export const metadata = {
  title: "Garantía y devoluciones — Velle",
  description:
    "Envío gratis a toda España, reposición sin coste si tu cuadro llega dañado y 14 días para devolverlo.",
};

// The Spanish guarantee for the cuadro. It is not made to order, so the
// standard 14-day right of withdrawal applies -- unlike the personalized
// prints covered by /returns.
export default function DevolucionesPage() {
  return (
    <div lang="es" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-medium">Garantía y devoluciones</h1>
      <p className="mt-6 text-muted">
        Queremos que tu cuadro llegue perfecto y que lo disfrutes muchos años. Esto es lo que te garantizamos.
      </p>

      <h2 className="mt-10 text-lg font-medium">Si llega dañado o no llega</h2>
      <p className="mt-3 text-muted">
        Si tu cuadro llega dañado, defectuoso o no llega, escríbenos a{" "}
        <span className="font-medium">info@velle.es</span> con una foto y tu número de pedido, y te enviamos uno
        nuevo sin coste.
      </p>

      <h2 className="mt-10 text-lg font-medium">14 días para devolverlo</h2>
      <p className="mt-3 text-muted">
        Si cambias de opinión, tienes 14 días naturales desde la entrega para devolverlo, sin tener que darnos
        ningún motivo. Escríbenos a <span className="font-medium">info@velle.es</span> y te indicamos cómo hacerlo.
        El cuadro debe volver en buen estado y con todos sus componentes.
      </p>
      {/* TODO(javier): say who pays the return shipping (by law the customer
          does, unless we say otherwise -- if we cover it, state it here). */}
      <p className="mt-3 text-muted">
        Te devolvemos el importe con el mismo método de pago en un plazo máximo de 14 días desde que nos
        comunicas la devolución. Podemos esperar a recibir el cuadro antes de hacer el reembolso.
      </p>

      <h2 className="mt-10 text-lg font-medium">Garantía legal</h2>
      <p className="mt-3 text-muted">
        Como todos los productos que se venden en España, tu cuadro tiene 3 años de garantía legal de conformidad.
        Si deja de funcionar bien, escríbenos y lo solucionamos.
      </p>

      <h2 className="mt-10 text-lg font-medium">Envío</h2>
      {/* TODO(javier): add the real delivery time once the carrier's is confirmed. */}
      <p className="mt-3 text-muted">
        El envío a toda España es gratis. Recibirás un email con el seguimiento en cuanto tu pedido salga de
        nuestro almacén.
      </p>

      <p className="mt-12 text-sm">
        <Link href={PRODUCT_PATH} className="text-[#c98b4f] hover:underline">
          ← Volver al cuadro
        </Link>
      </p>
    </div>
  );
}
