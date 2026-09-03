'use client';

import type { MetodoEnvio } from '@/lib/data-source/types';
import { OPCIONES_ENVIO } from '@/lib/shipping/rules';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function ShippingSelector({
  value,
  onChange,
}: {
  value: MetodoEnvio;
  onChange: (metodo: MetodoEnvio) => void;
}) {
  return (
    <div className="space-y-3">
      {OPCIONES_ENVIO.map((opcion) => (
        <label
          key={opcion.id}
          className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 ${
            value === opcion.id ? 'border-dark bg-surface-alt' : 'border-black/15'
          }`}
        >
          <input
            type="radio"
            name="metodoEnvio"
            value={opcion.id}
            checked={value === opcion.id}
            onChange={() => onChange(opcion.id)}
            className="mt-1 h-4 w-4 accent-accent-dark"
          />
          <span className="flex-1">
            <span className="block font-semibold text-dark">{opcion.nombre}</span>
            <span className="block text-sm text-neutral-500">{opcion.descripcion}</span>
            <span className="block text-xs text-neutral-400">{opcion.tiempoEstimado}</span>
          </span>
          <span className="font-semibold text-dark">
            {opcion.costo === 0 ? 'Gratis' : formatoCOP.format(opcion.costo)}
          </span>
        </label>
      ))}
    </div>
  );
}
