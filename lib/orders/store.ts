'use client';

import type { Pedido } from '../data-source/types';

const STORAGE_KEY = 'jeya-orders-v1';

/**
 * Registro de pedidos confirmados. Es un mock para Fase 2 — mientras no
 * exista backend real de pedidos, el estado de "seguimiento" se simula
 * aquí en el navegador que hizo la compra. El contrato (Pedido) es el
 * mismo que usará el backend real cuando exista.
 */
function readOrders(): Record<string, Pedido> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Pedido>) : {};
  } catch {
    return {};
  }
}

function writeOrders(orders: Record<string, Pedido>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function saveOrder(order: Pedido) {
  const orders = readOrders();
  orders[order.orderId.trim().toUpperCase()] = order;
  writeOrders(orders);
}

export function getOrder(orderId: string): Pedido | undefined {
  const orders = readOrders();
  return orders[orderId.trim().toUpperCase()];
}
