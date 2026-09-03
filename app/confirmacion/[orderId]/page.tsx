'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrder } from '@/lib/orders/store';
import { getShippingOption } from '@/lib/shipping/rules';
import type { Pedido } from '@/lib/data-source/types';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function ConfirmacionPage({ params }: { params: { orderId: string } }) {
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);

  useEffect(() => {
    setPedido(getOrder(decodeURIComponent(params.orderId)) ?? null);
  }, [params.orderId]);

  if (pedido === undefined) {
    return null;
  }

  if (pedido === null) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-xl px-5 text-center">
          <h1 className="mb-4 font-heading text-2xl font-semibold text-dark">
            No encontramos ese pedido
          </h1>
          <p className="mb-6 text-neutral-600">
            Verifica el número de pedido o intenta buscarlo en seguimiento.
          </p>
          <Link href="/seguimiento" className="btn-primary">
            Ir a seguimiento
          </Link>
        </div>
      </section>
    );
  }

  const opcionEnvio = getShippingOption(pedido.metodoEnvio);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-xl px-5 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-dark">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 7 9 18l-5-5" />
          </svg>
        </div>
        <p className="eyebrow">Pedido confirmado</p>
        <h1 className="mb-2 font-heading text-3xl font-semibold text-dark">¡Gracias por tu compra!</h1>
        <p className="mb-8 text-neutral-600">
          Te enviamos la confirmación a <strong>{pedido.comprador.email}</strong>. Guarda tu
          número de pedido para hacerle seguimiento.
        </p>

        <div className="mb-8 rounded-md bg-surface-alt p-6 text-left">
          <p className="mb-4 text-center">
            <span className="block text-xs uppercase tracking-wide text-neutral-500">
              Número de pedido
            </span>
            <span className="font-heading text-2xl font-bold text-dark">{pedido.orderId}</span>
          </p>
          <div className="space-y-1 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatoCOP.format(pedido.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Envío ({opcionEnvio.nombre})</span>
              <span>{pedido.costoEnvio === 0 ? 'Gratis' : formatoCOP.format(pedido.costoEnvio)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-dark">
              <span>Total</span>
              <span>{formatoCOP.format(pedido.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/seguimiento" className="btn-outline">
            Seguir mi pedido
          </Link>
          <Link href="/productos" className="btn-primary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </section>
  );
}
