'use client';

import { useState } from 'react';
import { getOrder } from '@/lib/orders/store';
import type { Pedido } from '@/lib/data-source/types';

const ESTADOS: Pedido['estado'][] = ['confirmado', 'preparando', 'enviado', 'entregado'];

const ESTADO_LABEL: Record<Pedido['estado'], string> = {
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
};

export default function SeguimientoPage() {
  const [numeroPedido, setNumeroPedido] = useState('');
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [buscado, setBuscado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPedido(getOrder(numeroPedido) ?? null);
    setBuscado(true);
  }

  const pasoActual = pedido ? ESTADOS.indexOf(pedido.estado) : -1;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-xl px-5">
        <p className="eyebrow">Seguimiento</p>
        <h1 className="mb-6 font-heading text-3xl font-semibold text-dark">Seguimiento de pedido</h1>

        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <label className="flex-1">
            <span className="sr-only">Número de pedido</span>
            <input
              type="text"
              value={numeroPedido}
              onChange={(e) => setNumeroPedido(e.target.value)}
              placeholder="Ej. #ORD-20260903-0421"
              className="input-field"
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        {buscado && !pedido && (
          <p className="rounded-sm bg-surface-alt p-4 text-sm text-neutral-600">
            No encontramos un pedido con ese número en este navegador. Verifica que lo hayas
            copiado correctamente desde tu confirmación de compra.
          </p>
        )}

        {pedido && (
          <div className="rounded-md bg-surface-alt p-6">
            <p className="mb-1 text-sm text-neutral-500">Pedido</p>
            <p className="mb-6 font-heading text-xl font-bold text-dark">{pedido.orderId}</p>

            <ol className="flex justify-between text-xs">
              {ESTADOS.map((estado, i) => (
                <li key={estado} className="flex flex-1 flex-col items-center gap-2 text-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                      i <= pasoActual ? 'bg-accent-dark' : 'bg-neutral-300'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={i <= pasoActual ? 'font-semibold text-dark' : 'text-neutral-400'}>
                    {ESTADO_LABEL[estado]}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-sm text-neutral-500">
              Comprado el{' '}
              {new Date(pedido.fecha).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        <p className="mt-6 text-xs text-neutral-400">
          * En esta fase, el estado del pedido se simula en tu navegador. En producción se
          conecta al backend de pedidos y a la transportadora.
        </p>
      </div>
    </section>
  );
}
