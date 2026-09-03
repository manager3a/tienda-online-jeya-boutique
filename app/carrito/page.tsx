'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, calculateSubtotal } from '@/lib/cart/store';
import { getProductById } from '@/lib/data-source/client';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function CarritoPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = calculateSubtotal(items);

  if (items.length === 0) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <p className="eyebrow">Carrito</p>
          <h1 className="mb-4 font-heading text-3xl font-semibold text-dark">Tu carrito está vacío</h1>
          <p className="mb-6 text-neutral-600">
            Explora el catálogo y encuentra tu próxima pieza favorita.
          </p>
          <Link href="/productos" className="btn-primary">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-5">
        <p className="eyebrow">Carrito</p>
        <h1 className="mb-8 font-heading text-3xl font-semibold text-dark">Tu carrito</h1>

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-black/10">
            {items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <li key={`${item.productId}-${item.talla}-${item.color}`} className="flex gap-4 py-5">
                  <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-surface-alt">
                    <Image src={product.imagen} alt={product.nombre} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/productos/${product.slug}`} className="font-heading text-lg font-semibold text-dark hover:underline">
                      {product.nombre}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      Talla {item.talla} · {item.color}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-dark">
                      {formatoCOP.format(product.precio)}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Disminuir cantidad"
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-black/15"
                        onClick={() =>
                          updateQuantity(item.productId, item.talla, item.color, item.cantidad - 1)
                        }
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{item.cantidad}</span>
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-black/15"
                        onClick={() =>
                          updateQuantity(item.productId, item.talla, item.color, item.cantidad + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-sm text-neutral-400 underline"
                        onClick={() => removeItem(item.productId, item.talla, item.color)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <p className="w-24 text-right font-semibold text-dark">
                    {formatoCOP.format(product.precio * item.cantidad)}
                  </p>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-md bg-surface-alt p-6">
            <h2 className="mb-4 font-heading text-xl font-semibold text-dark">Resumen</h2>
            <div className="mb-2 flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>{formatoCOP.format(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-neutral-500">
              El costo de envío se calcula en el checkout según el método elegido.
            </p>
            <Link href="/checkout" className="btn-primary block w-full text-center">
              Finalizar compra
            </Link>
            <Link href="/productos" className="btn-ghost mt-3 block w-full text-center">
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
