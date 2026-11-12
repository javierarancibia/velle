import { A, Email, H2, LegalPage, P, UL } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Política de privacidad — Velle",
  description: "Qué datos recogemos al comprar en velle.es, para qué y cuáles son tus derechos.",
};

// Keep the providers list in sync with the stack: Stripe (payments), Supabase
// (orders database), Vercel (hosting), Resend (order emails), Meta (pixel,
// only with consent) and the carrier that delivers the parcel.
export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <P>
        Aquí te explicamos, de forma clara, qué datos tuyos tratamos cuando compras o navegas en {LEGAL.site},
        conforme al Reglamento General de Protección de Datos (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).
      </P>

      <H2>Responsable</H2>
      <UL>
        <li>
          {LEGAL.name} («{LEGAL.tradeName}») · NIF-IVA {LEGAL.taxId}
        </li>
        <li>{LEGAL.address}</li>
        <li>
          Email: <Email />
        </li>
      </UL>

      <H2>Qué datos tratamos y para qué</H2>
      <UL>
        <li>
          <span className="text-foreground">Para gestionar tu pedido:</span> nombre, email, teléfono,
          dirección de envío, lo que has comprado y el importe. Los usamos para preparar y enviar tu cuadro,
          avisarte del envío, atender devoluciones y garantías, y emitir la factura. Base legal: el contrato de
          compra.
        </li>
        <li>
          <span className="text-foreground">Pago:</span> los datos de tu tarjeta o de Bizum los introduces en la
          página segura de Stripe. Nosotros nunca los vemos ni los guardamos.
        </li>
        <li>
          <span className="text-foreground">Obligaciones legales:</span> conservamos los datos de facturación el
          tiempo que exige la normativa fiscal y mercantil. Base legal: obligación legal.
        </li>
        <li>
          <span className="text-foreground">Cuando nos escribes:</span> tu email y lo que nos cuentas, para
          responderte. Base legal: tu solicitud y nuestro interés legítimo en atenderte.
        </li>
        <li>
          <span className="text-foreground">Medición de anuncios:</span> solo si aceptas las cookies de Meta, el
          píxel de Meta registra qué páginas visitas y si compras, para saber qué anuncios funcionan. Base legal:
          tu consentimiento, que puedes retirar cuando quieras. Más detalles en la{" "}
          <A href="/cookies">política de cookies</A>.
        </li>
      </UL>
      <P>No te enviamos publicidad por email ni vendemos tus datos a nadie.</P>

      <H2>Cuánto tiempo los guardamos</H2>
      <P>
        Los datos del pedido, mientras dure la garantía legal del producto (3 años desde la entrega). Los datos
        de facturación y contabilidad, hasta 6 años, como exige el Código de Comercio. Los mensajes que nos
        envías, el tiempo necesario para resolver tu consulta. Pasados esos plazos, los borramos.
      </P>

      <H2>Con quién los compartimos</H2>
      <P>Solo con los proveedores que necesitamos para que la tienda funcione, que actúan por encargo nuestro:</P>
      <UL>
        <li>Stripe: procesa el pago con tarjeta o Bizum.</li>
        <li>Supabase: base de datos donde guardamos los pedidos.</li>
        <li>Vercel: alojamiento de la web.</li>
        <li>Resend: envío de los emails relacionados con tu pedido.</li>
        <li>La empresa de transporte que te entrega el paquete: nombre, dirección y teléfono.</li>
        <li>Meta Platforms Ireland: solo si aceptas sus cookies de medición.</li>
      </UL>
      <P>
        Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, por ejemplo en
        Estados Unidos. En ese caso lo hacen con garantías adecuadas: el Marco de Privacidad de Datos UE-EE. UU.
        o las cláusulas contractuales tipo de la Comisión Europea.
      </P>
      <P>También podemos entregar datos a las autoridades cuando la ley nos obligue.</P>

      <H2>Tus derechos</H2>
      <P>
        Puedes pedirnos acceder a tus datos, corregirlos, borrarlos, limitar su uso, oponerte a su tratamiento o
        recibirlos en un formato portable. Escríbenos a <Email /> indicando qué necesitas; te responderemos en
        un plazo máximo de un mes.
      </P>
      <P>
        Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de
        Datos en <A href="https://www.aepd.es">www.aepd.es</A>.
      </P>

      <H2>Menores</H2>
      <P>La tienda está dirigida a mayores de 18 años. No recogemos a sabiendas datos de menores.</P>

      <H2>Cambios</H2>
      <P>
        Si cambiamos esta política, publicaremos aquí la nueva versión con su fecha de actualización.
      </P>
    </LegalPage>
  );
}
