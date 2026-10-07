'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Producto } from '@/lib/data-source/types';
import { addItem } from '@/lib/cart/store';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const GRADIENTES: Record<string, string> = {
  Bronce: 'from-[#9a6a3c] to-[#6b4423]',
  Plata: 'from-[#d7dadb] to-[#9398a0]',
  Dorado: 'from-[#e8c877] to-[#b8862f]',
};

export default function GiftCardTile({ producto }: { producto: Producto }) {
  const variante = producto.variantes[0];
  const [confirmado, setConfirmado] = useState(false);
  const gradiente = GRADIENTES[variante.color] ?? GRADIENTES.Plata;

  function handleAdd() {
    addItem(producto.id, variante.talla, variante.color, 1);
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2200);
  }

  return (
    <article className="flex flex-col items-center">
      <div
        className={`group relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-xl bg-gradient-to-br ${gradiente} shadow-card transition-transform duration-300 hover:scale-105`}
      >
        <span
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg"
          aria-hidden="true"
          title="Tarjeta de regalo"
        >
          🎀
        </span>
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/90 shadow">
            <Image src="/images/logo-jeya.jpg" alt="Jeya Boutique" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
          </div>
          <p className="font-heading text-lg font-bold uppercase tracking-wide text-white drop-shadow">
            Tarjeta {variante.color}
          </p>
          <p className="font-heading text-2xl font-extrabold text-white drop-shadow">
            {formatoCOP.format(producto.precio)}
          </p>
        </div>
      </div>

      <button type="button" onClick={handleAdd} className="btn-primary mt-5 w-full max-w-sm">
        {confirmado ? 'Agregada al carrito ✓' : 'Regalar esta tarjeta'}
      </button>
    </article>
  );
}
