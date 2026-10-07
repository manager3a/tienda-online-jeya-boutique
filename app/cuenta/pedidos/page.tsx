'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/store';
import { getOrdersForUser } from '@/lib/orders/supabase';
import type { Pedido } from '@/lib/data-source/types';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const ESTADO_LABEL: Record<Pedido['estado'], string> = {
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
};

export default function MisComprasPage() {
  const { user, loading } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);

  useEffect(() => {
    if (!user) return;
    getOrdersForUser(user.id).then(setPedidos);
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-8 font-heading text-2xl font-semibold text-dark">Mis compras</h1>

      {loading ? null : !user ? (
        <p className="text-sm text-neutral-500">Inicia sesión para ver tu historial de compras.</p>
      ) : pedidos === null ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : pedidos.length === 0 ? (
        <p className="text-sm text-neutral-500">Todavía no tienes pedidos.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {pedidos.map((pedido) => (
            <li key={pedido.orderId} className="rounded-md border border-black/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading text-lg font-semibold text-dark">
                  Pedido {pedido.orderId}
                </span>
                <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-accent-dark">
                  {ESTADO_LABEL[pedido.estado]}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {new Date(pedido.fecha).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="mt-3 font-bold text-dark">{formatoCOP.format(pedido.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
