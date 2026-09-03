'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart, calculateSubtotal } from '@/lib/cart/store';
import { getProductById } from '@/lib/data-source/client';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = calculateSubtotal(items);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-dark/55 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col bg-surface p-6 shadow-card transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-dark">Tu carrito</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="flex h-11 w-11 items-center justify-center text-3xl leading-none text-dark"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-neutral-500">Tu carrito está vacío.</p>
            <Link href="/productos" onClick={onClose} className="btn-primary">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <li key={`${item.productId}-${item.talla}-${item.color}`} className="flex gap-3">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-surface-alt">
                      <Image src={product.imagen} alt={product.nombre} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{product.nombre}</p>
                      <p className="text-xs text-neutral-500">
                        Talla {item.talla} · {item.color}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          className="flex h-7 w-7 items-center justify-center rounded border border-black/15"
                          onClick={() =>
                            updateQuantity(item.productId, item.talla, item.color, item.cantidad - 1)
                          }
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm">{item.cantidad}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          className="flex h-7 w-7 items-center justify-center rounded border border-black/15"
                          onClick={() =>
                            updateQuantity(item.productId, item.talla, item.color, item.cantidad + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-xs text-neutral-400 underline"
                          onClick={() => removeItem(item.productId, item.talla, item.color)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-dark">
                      {formatoCOP.format(product.precio * item.cantidad)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 border-t border-black/10 pt-4">
              <div className="mb-4 flex items-center justify-between font-semibold text-dark">
                <span>Subtotal</span>
                <span>{formatoCOP.format(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-neutral-500">
                El envío se calcula en el checkout según el método elegido.
              </p>
              <Link href="/carrito" onClick={onClose} className="btn-outline mb-2 block text-center">
                Ver carrito
              </Link>
              <Link href="/checkout" onClick={onClose} className="btn-primary block text-center">
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
