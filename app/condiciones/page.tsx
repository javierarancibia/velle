import { A, Email, H2, LegalPage, P, UL } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Condiciones de venta — Velle",
  description: "Precios, pago, envío, desistimiento y garantía al comprar en velle.es.",
};

// Must stay consistent with /devoluciones (14 days, free replacement if
// damaged, 3-year legal guarantee) and with the product page (prices, free
// shipping, 24-72 h delivery).
export default function CondicionesPage() {
  return (
    <LegalPage title="Condiciones de venta">
      <P>
        Estas condiciones se aplican a las compras que hagas en {LEGAL.site}. Al hacer un pedido confirmas que las
        has leído y las aceptas. El vendedor es {LEGAL.name}, que opera como «{LEGAL.tradeName}», con NIF-IVA {LEGAL.taxId} y dirección en {LEGAL.address}.
        Puedes escribirnos a <Email />.
      </P>

      <H2>1. Producto</H2>
      <P>
        Vendemos el cuadro «La Luz de Jesús»: un cuadro con marco de madera e iluminación LED regulable. En la
        página del producto encontrarás sus características, medidas y fotos. Los colores pueden variar
        ligeramente según la pantalla.
      </P>

      <H2>2. Precios</H2>
      <P>
        Los precios están en euros y son finales, sin gastos adicionales. El envío a España es gratis. El precio que pagas es el que
        ves en el momento de hacer el pedido.
      </P>

      <H2>3. Cómo se hace un pedido</H2>
      <UL>
        <li>Eliges cuántos cuadros quieres y pulsas el botón de compra.</li>
        <li>
          Introduces tus datos de envío y pagas en la página segura de Stripe. Antes de pagar puedes revisar y
          corregir tu pedido.
        </li>
        <li>
          Al confirmar el pago, el contrato queda cerrado y te enviamos por email la confirmación del pedido con
          su número y su importe.
        </li>
      </UL>
      <P>El contrato se formaliza en español.</P>

      <H2>4. Pago</H2>
      <P>
        Puedes pagar con tarjeta o con Bizum. El pago lo procesa Stripe de forma segura; nosotros no vemos ni
        guardamos los datos de tu tarjeta. El cargo se hace en el momento de la compra.
      </P>

      <H2>5. Envío y entrega</H2>
      <P>
        Enviamos a toda España. Tu pedido llega normalmente en 24–72 horas. Si por cualquier motivo se retrasa, te
        avisaremos; en ningún caso tardaremos más de 30 días. Si no podemos entregarlo, te devolvemos el dinero
        entero.
      </P>
      <P>
        Si tu cuadro llega dañado o defectuoso, escríbenos con una foto y tu número de pedido y te enviamos uno
        nuevo sin coste.
      </P>

      <H2>6. Derecho de desistimiento: 14 días</H2>
      <P>
        Tienes 14 días naturales desde que recibes el cuadro para devolverlo sin dar ningún motivo. Para hacerlo,
        escríbenos a <Email /> diciéndonos tu número de pedido y que quieres devolverlo. Si lo prefieres, puedes
        usar el formulario de abajo.
      </P>
      <P>
        Tendrás que enviarnos el cuadro en buen estado y con todos sus componentes en un plazo máximo de 14 días
        desde que nos lo comunicas. Te indicaremos la dirección de devolución. Los gastos de envío de la
        devolución corren de tu cuenta, salvo que el cuadro haya llegado dañado o no sea el que pediste.
      </P>
      <P>
        Te devolvemos todo lo que pagaste con el mismo método de pago en un plazo máximo de 14 días desde que nos
        comunicas que desistes. Podemos esperar a recibir el cuadro, o a que nos envíes el justificante de
        envío, antes de hacer el reembolso. Más información en{" "}
        <A href="/devoluciones">garantía y devoluciones</A>.
      </P>

      <div className="mt-4 rounded-xl border border-border p-4 text-sm">
        <p className="font-medium text-foreground">Formulario de desistimiento</p>
        <p className="mt-2">
          (Solo tienes que rellenarlo y enviárnoslo si quieres devolver el pedido.)
        </p>
        <p className="mt-2">
          A la atención de {LEGAL.name}, {LEGAL.address}, {LEGAL.email}:
        </p>
        <p className="mt-2">
          Por la presente le comunico que desisto de mi contrato de venta del siguiente bien: ______
        </p>
        <UL>
          <li>Pedido el / recibido el: ______</li>
          <li>Número de pedido: ______</li>
          <li>Nombre: ______</li>
          <li>Dirección: ______</li>
          <li>Firma (solo si lo envías en papel): ______</li>
          <li>Fecha: ______</li>
        </UL>
      </div>

      <H2>7. Garantía</H2>
      <P>
        Tu cuadro tiene 3 años de garantía legal de conformidad desde la entrega, según el Real Decreto
        Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios). Si deja de funcionar
        bien, escríbenos y lo reparamos, lo cambiamos o te devolvemos el dinero, según lo que corresponda.
      </P>

      <H2>8. Atención al cliente y reclamaciones</H2>
      <P>
        Para cualquier duda, incidencia o reclamación escríbenos a <Email />. Te responderemos lo antes posible y
        siempre en menos de un mes.
      </P>

      <H2>9. Ley aplicable</H2>
      <P>
        Estas condiciones se rigen por la ley española. Si eres consumidor, puedes acudir a los juzgados de tu
        domicilio.
      </P>
    </LegalPage>
  );
}
