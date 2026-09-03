'use client';

import { useMemo, useState } from 'react';
import type { Producto } from '@/lib/data-source/types';
import { addItem } from '@/lib/cart/store';

export default function ProductVariantForm({ producto }: { producto: Producto }) {
  const tallas = useMemo(
    () => Array.from(new Set(producto.variantes.map((v) => v.talla))),
    [producto]
  );
  const [talla, setTalla] = useState(tallas[0]);

  const coloresDisponibles = useMemo(
    () => producto.variantes.filter((v) => v.talla === talla),
    [producto, talla]
  );
  const [color, setColor] = useState(coloresDisponibles[0]?.color ?? '');
  const [cantidad, setCantidad] = useState(1);
  const [confirmado, setConfirmado] = useState(false);

  const varianteActual = coloresDisponibles.find((v) => v.color === color) ?? coloresDisponibles[0];
  const stockDisponible = varianteActual?.stock ?? 0;

  function handleTalla(nuevaTalla: string) {
    setTalla(nuevaTalla);
    const primeraDisponible = producto.variantes.find((v) => v.talla === nuevaTalla);
    if (primeraDisponible) setColor(primeraDisponible.color);
  }

  function handleAdd() {
    if (!varianteActual || stockDisponible <= 0) return;
    addItem(producto.id, talla, varianteActual.color, cantidad);
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2200);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-dark">Talla</p>
        <div className="flex flex-wrap gap-2">
          {tallas.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTalla(t)}
              className={`flex h-11 min-w-[44px] items-center justify-center rounded-sm border px-3 text-sm font-medium ${
                talla === t ? 'border-dark bg-dark text-white' : 'border-black/20 bg-white text-dark'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-dark">Color</p>
        <div className="flex flex-wrap gap-2">
          {coloresDisponibles.map((v) => (
            <button
              key={v.color}
              type="button"
              onClick={() => setColor(v.color)}
              title={v.color}
              aria-label={v.color}
              aria-pressed={color === v.color}
              className={`h-10 w-10 rounded-full border-2 ${
                color === v.color ? 'border-accent-dark' : 'border-black/15'
              }`}
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-neutral-500">{color}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-dark">Cantidad</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-black/20"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
          >
            −
          </button>
          <span className="w-6 text-center">{cantidad}</span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-black/20"
            onClick={() => setCantidad((c) => Math.min(stockDisponible || 1, c + 1))}
          >
            +
          </button>
        </div>
      </div>

      <p className="text-sm text-accent-dark">
        {stockDisponible > 0 ? `${stockDisponible} disponibles en esta variante` : 'Sin stock en esta variante'}
      </p>

      <button
        type="button"
        onClick={handleAdd}
        disabled={stockDisponible <= 0}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {confirmado ? 'Agregado ✓' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
