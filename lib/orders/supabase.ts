'use client';

import { supabase } from '@/lib/supabase/client';
import type { Pedido } from '../data-source/types';

/**
 * Persistencia real de pedidos en Supabase (tabla `orders`, ver
 * docs/supabase-orders.sql para el esquema + RLS). Complementa, no
 * reemplaza, a lib/orders/store.ts: ese mock en localStorage sigue
 * funcionando para compradores invitados sin cuenta.
 */
export async function saveOrderToSupabase(pedido: Pedido, userId: string) {
  if (!supabase) return;
  const { error } = await supabase.from('orders').insert({
    user_id: userId,
    order_id: pedido.orderId,
    fecha: pedido.fecha,
    items: pedido.items,
    subtotal: pedido.subtotal,
    costo_envio: pedido.costoEnvio,
    total: pedido.total,
    metodo_envio: pedido.metodoEnvio,
    estado: pedido.estado,
    comprador: pedido.comprador,
  });
  if (error) {
    console.error('[orders] No se pudo guardar el pedido en Supabase:', error.message);
  }
}

export async function getOrdersForUser(userId: string): Promise<Pedido[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    orderId: row.order_id,
    fecha: row.fecha,
    items: row.items,
    subtotal: row.subtotal,
    costoEnvio: row.costo_envio,
    total: row.total,
    metodoEnvio: row.metodo_envio,
    estado: row.estado,
    comprador: row.comprador,
  }));
}
