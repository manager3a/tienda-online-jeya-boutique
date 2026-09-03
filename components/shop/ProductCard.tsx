'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/lib/data-source/types';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function ProductCard({
  producto,
  onQuickView,
}: {
  producto: Producto;
  onQuickView?: (producto: Producto) => void;
}) {
  const stockTotal = producto.variantes.reduce((sum, v) => sum + v.stock, 0);

  return (
    <article className="flex flex-col overflow-hidden rounded-md bg-surface shadow-card transition-transform hover:-translate-y-1">
      <div className="group relative block aspect-[4/5] overflow-hidden">
        <Link href={`/productos/${producto.slug}`} className="absolute inset-0 z-0">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(min-width: 1440px) 23vw, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {producto.badge && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-sm bg-accent px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-dark">
            {producto.badge}
          </span>
        )}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(producto)}
            className="absolute bottom-3 right-3 z-10 min-h-[36px] rounded-sm bg-white/95 px-3 text-xs font-semibold text-dark shadow-card"
          >
            Vista rápida
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 p-5">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-accent-dark">
          {producto.categoria}
        </p>
        <Link href={`/productos/${producto.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-dark hover:underline">
            {producto.nombre}
          </h3>
        </Link>
        <p className="mt-1 font-bold text-dark">
          {formatoCOP.format(producto.precio)}
          {producto.precioOriginal && (
            <span className="ml-2 text-xs font-normal text-neutral-400 line-through">
              {formatoCOP.format(producto.precioOriginal)}
            </span>
          )}
        </p>
        <p className="mb-3 text-[0.78rem] text-accent-dark">
          {stockTotal > 0 ? 'Disponible' : 'Agotado'}
        </p>
        <Link href={`/productos/${producto.slug}`} className="btn-primary block w-full text-center">
          Ver producto
        </Link>
      </div>
    </article>
  );
}
