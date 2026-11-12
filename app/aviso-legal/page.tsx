import { A, Email, H2, LegalPage, P, UL } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Aviso legal — Velle",
  description: "Quién está detrás de velle.es y las condiciones de uso de la web.",
};

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <P>
        En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
        electrónico (LSSI), estos son los datos del titular de {LEGAL.site}:
      </P>
      <UL>
        <li>Titular: {LEGAL.name}, que opera como «{LEGAL.tradeName}»</li>
        <li>Forma jurídica: {LEGAL.legalForm}</li>
        <li>Registro: {LEGAL.registry}</li>
        <li>NIF-IVA: {LEGAL.taxId}</li>
        <li>Dirección: {LEGAL.address}</li>
        <li>
          Email: <Email />
        </li>
        <li>Nombre comercial: Velle</li>
      </UL>

      <H2>Uso de la web</H2>
      <P>
        Al navegar por {LEGAL.site} aceptas usarla de forma lícita y no dañar su funcionamiento. Las compras se
        rigen por nuestras <A href="/condiciones">condiciones de venta</A>.
      </P>

      <H2>Propiedad intelectual</H2>
      <P>
        Los textos, fotos, vídeos, diseños y la marca Velle son de su titular o se usan con permiso. No puedes
        copiarlos ni reutilizarlos sin nuestra autorización por escrito.
      </P>

      <H2>Responsabilidad</H2>
      <P>
        Cuidamos que la información de la web sea correcta y esté al día, pero puede contener errores puntuales
        que corregiremos en cuanto los detectemos. No respondemos del contenido de las webs de terceros a las que
        enlazamos.
      </P>

      <H2>Datos personales y cookies</H2>
      <P>
        Cómo tratamos tus datos se explica en la <A href="/privacidad">política de privacidad</A>, y qué cookies
        usamos, en la <A href="/cookies">política de cookies</A>.
      </P>

      <H2>Ley aplicable</H2>
      <P>
        Esta web se rige por la ley española. Si eres consumidor, cualquier conflicto se resolverá en los
        juzgados de tu domicilio.
      </P>
    </LegalPage>
  );
}
