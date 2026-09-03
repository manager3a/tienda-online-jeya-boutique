'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Producto } from '@/lib/data-source/types';
import ProductVariantForm from './ProductVariantForm';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function ProductModal({
  producto,
  onClose,
}: {
  producto: Producto;
  onClose: () => void;
}) {
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={producto.nombre}
        className="relative z-10 grid max-h-[90vh] w-full max-w-3xl grid-cols-1 gap-6 overflow-y-auto rounded-md bg-surface p-6 shadow-card md:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-2xl text-dark"
        >
          &times;
        </button>

        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-alt">
            <Image
              src={producto.imagenes[imagenActiva] ?? producto.imagen}
              alt={producto.nombre}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          {producto.imagenes.length > 1 && (
            <div className="mt-3 flex gap-2">
              {producto.imagenes.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setImagenActiva(i)}
                  className={`relative h-16 w-14 overflow-hidden rounded-sm border-2 ${
                    imagenActiva === i ? 'border-accent-dark' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-accent-dark">
            {producto.categoria}
          </p>
          <h2 className="mb-2 font-heading text-2xl font-semibold text-dark">{producto.nombre}</h2>
          <p className="mb-4 font-bold text-dark">{formatoCOP.format(producto.precio)}</p>
          <p className="mb-5 text-sm text-neutral-600">{producto.descripcion}</p>
          <ProductVariantForm producto={producto} />
        </div>
      </div>
    </div>
  );
}
