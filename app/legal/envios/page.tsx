import type { Metadata } from 'next';
import { OPCIONES_ENVIO } from '@/lib/shipping/rules';

export const metadata: Metadata = { title: 'Política de Envíos — Jeya Boutique' };

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function EnviosPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow">Legal</p>
        <h1 className="mb-6 font-heading text-3xl font-semibold text-dark">Política de Envíos</h1>
        <div className="space-y-5 text-sm leading-relaxed text-neutral-600">
          <p>
            Despachamos desde nuestra tienda en Carrera 8H #164C-13, Bogotá. Todos los pedidos
            se procesan dentro de las 24-48 horas hábiles siguientes a la confirmación del pago.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10 text-dark">
                  <th className="py-2 pr-4">Método</th>
                  <th className="py-2 pr-4">Zona</th>
                  <th className="py-2 pr-4">Tiempo estimado</th>
                  <th className="py-2">Costo</th>
                </tr>
              </thead>
              <tbody>
                {OPCIONES_ENVIO.map((o) => (
                  <tr key={o.id} className="border-b border-black/5">
                    <td className="py-2 pr-4 font-medium text-dark">{o.nombre}</td>
                    <td className="py-2 pr-4">{o.descripcion}</td>
                    <td className="py-2 pr-4">{o.tiempoEstimado}</td>
                    <td className="py-2">{o.costo === 0 ? 'Gratis' : formatoCOP.format(o.costo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="font-heading text-xl font-semibold text-dark">Cobertura</h2>
          <p>
            El envío nacional cubre todo el territorio colombiano a través de transportadora.
            La recogida en tienda está disponible en nuestra dirección en Bogotá sin costo
            adicional.
          </p>
        </div>
      </div>
    </section>
  );
}
