import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Política de Privacidad y Cookies — Jeya Boutique' };

export default function PrivacidadPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow">Legal</p>
        <h1 className="mb-6 font-heading text-3xl font-semibold text-dark">
          Política de Privacidad y Cookies
        </h1>
        <div className="space-y-5 text-sm leading-relaxed text-neutral-600">
          <p>
            En Jeya Boutique respetamos tu privacidad. Este documento explica qué datos
            personales recopilamos, cómo los usamos y qué derechos tienes sobre ellos, en línea
            con la Ley 1581 de 2012 de Protección de Datos Personales de Colombia.
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Datos que recopilamos</h2>
          <p>
            Nombre, email, teléfono y dirección de entrega cuando realizas una compra o nos
            contactas por WhatsApp o chat. Nunca almacenamos datos de tarjetas de pago: el
            procesamiento de pagos lo realiza directamente Mercado Pago bajo sus propios
            estándares de seguridad (PCI-DSS).
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Uso de la información</h2>
          <p>
            Usamos tus datos para procesar pedidos, coordinar envíos, brindarte soporte y, si lo
            autorizas, enviarte novedades sobre nuevas colecciones.
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Cookies</h2>
          <p>
            Este sitio puede usar cookies técnicas necesarias para el funcionamiento del carrito
            de compras y, con tu consentimiento, cookies analíticas para entender cómo se usa el
            sitio y mejorar la experiencia.
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Tus derechos</h2>
          <p>
            Puedes solicitar acceso, corrección o eliminación de tus datos personales
            escribiendo a{' '}
            <a href="mailto:yanisnajar@hotmail.com" className="underline">
              yanisnajar@hotmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
