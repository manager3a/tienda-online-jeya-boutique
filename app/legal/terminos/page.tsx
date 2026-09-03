import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Términos y Condiciones de Compra — Jeya Boutique' };

export default function TerminosPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow">Legal</p>
        <h1 className="mb-6 font-heading text-3xl font-semibold text-dark">
          Términos y Condiciones de Compra
        </h1>
        <div className="space-y-5 text-sm leading-relaxed text-neutral-600">
          <h2 className="font-heading text-xl font-semibold text-dark">Precios y disponibilidad</h2>
          <p>
            Todos los precios están expresados en pesos colombianos (COP) e incluyen los
            impuestos aplicables. La disponibilidad de cada pieza se muestra en tiempo real en
            el catálogo según talla y color.
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Métodos de pago</h2>
          <p>
            Aceptamos pagos a través de Mercado Pago (tarjetas de crédito/débito, PSE y Nequi).
            El pago se procesa de forma segura fuera de nuestro sitio, directamente en la
            plataforma de Mercado Pago.
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Devoluciones y garantías</h2>
          <p>
            Tienes hasta 10 días calendario desde que recibes tu pedido para solicitar un
            cambio o devolución, siempre que la prenda conserve sus etiquetas originales y no
            haya sido usada. Escríbenos por WhatsApp al +57 301 579 4089 para iniciar el
            proceso. Los costos de envío de la devolución corren por cuenta del cliente, salvo
            en caso de producto defectuoso o error en el envío.
          </p>
          <h2 className="font-heading text-xl font-semibold text-dark">Procesamiento de pagos por terceros</h2>
          <p>
            El procesamiento de pagos es realizado por Mercado Pago, un proveedor externo.
            Jeya Boutique no almacena ni tiene acceso a los datos de tu tarjeta en ningún
            momento.
          </p>
        </div>
      </div>
    </section>
  );
}
