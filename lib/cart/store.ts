'use client';

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import type { ItemCarrito } from '../data-source/types';
import { getProductById } from '../data-source/client';

const STORAGE_KEY = 'jeya-cart-v1';

/**
 * El carrito en localStorage guarda SOLO productId + variante + cantidad.
 * Nunca precios ni totales: esos se recalculan siempre desde data-source
 * (ver lib/cart/totals.ts) para que el navegador nunca pueda manipular
 * un precio o un subtotal.
 */
let items: ItemCarrito[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): ItemCarrito[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (it): it is ItemCarrito =>
        typeof it?.productId === 'string' &&
        typeof it?.talla === 'string' &&
        typeof it?.color === 'string' &&
        typeof it?.cantidad === 'number' &&
        it.cantidad > 0
    );
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  items = readStorage();
  hydrated = true;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  ensureHydrated();
  return items;
}

function getServerSnapshot() {
  return [] as ItemCarrito[];
}

export function addItem(productId: string, talla: string, color: string, cantidad = 1) {
  ensureHydrated();
  const existing = items.find(
    (it) => it.productId === productId && it.talla === talla && it.color === color
  );
  if (existing) {
    items = items.map((it) =>
      it === existing ? { ...it, cantidad: it.cantidad + cantidad } : it
    );
  } else {
    items = [...items, { productId, talla, color, cantidad }];
  }
  persist();
}

export function updateQuantity(
  productId: string,
  talla: string,
  color: string,
  cantidad: number
) {
  ensureHydrated();
  if (cantidad <= 0) {
    removeItem(productId, talla, color);
    return;
  }
  items = items.map((it) =>
    it.productId === productId && it.talla === talla && it.color === color
      ? { ...it, cantidad }
      : it
  );
  persist();
}

export function removeItem(productId: string, talla: string, color: string) {
  ensureHydrated();
  items = items.filter(
    (it) => !(it.productId === productId && it.talla === talla && it.color === color)
  );
  persist();
}

export function clearCart() {
  items = [];
  persist();
}

export function useCart() {
  const cartItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const count = cartItems.reduce((sum, it) => sum + it.cantidad, 0);

  return {
    items: cartItems,
    count,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}

/**
 * Recalcula subtotal SIEMPRE desde data-source (fuente de verdad),
 * ignorando cualquier precio que pudiera venir del cliente.
 */
export function calculateSubtotal(cartItems: ItemCarrito[]): number {
  return cartItems.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + product.precio * item.cantidad;
  }, 0);
}

export function useCartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  return { isOpen, open, close };
}
