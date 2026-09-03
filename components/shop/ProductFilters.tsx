'use client';

import { useMemo, useState } from 'react';
import type { Categoria, Producto } from '@/lib/data-source/types';
import ProductGrid from './ProductGrid';

const CATEGORIAS: { id: Categoria | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'blusas', label: 'Blusas' },
  { id: 'chaquetas', label: 'Chaquetas' },
  { id: 'zapatos', label: 'Zapatos' },
  { id: 'faldas', label: 'Faldas' },
  { id: 'bolsos', label: 'Bolsos' },
];

const ORDEN: { id: 'relevancia' | 'menor-precio' | 'mayor-precio'; label: string }[] = [
  { id: 'relevancia', label: 'Relevancia' },
  { id: 'menor-precio', label: 'Menor precio' },
  { id: 'mayor-precio', label: 'Mayor precio' },
];

export default function ProductFilters({
  productos,
  categoriaInicial = 'todos',
}: {
  productos: Producto[];
  categoriaInicial?: Categoria | 'todos';
}) {
  const [categoria, setCategoria] = useState<Categoria | 'todos'>(categoriaInicial);
  const [busqueda, setBusqueda] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [orden, setOrden] = useState<'relevancia' | 'menor-precio' | 'mayor-precio'>('relevancia');

  const filtrados = useMemo(() => {
    let result = productos;

    if (categoria !== 'todos') {
      result = result.filter((p) => p.categoria === categoria);
    }

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      result = result.filter(
        (p) => p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
      );
    }

    if (soloDisponibles) {
      result = result.filter((p) => p.variantes.some((v) => v.stock > 0));
    }

    if (orden === 'menor-precio') {
      result = [...result].sort((a, b) => a.precio - b.precio);
    } else if (orden === 'mayor-precio') {
      result = [...result].sort((a, b) => b.precio - a.precio);
    }

    return result;
  }, [productos, categoria, busqueda, soloDisponibles, orden]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-3">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoria(c.id)}
            className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              categoria === c.id
                ? 'border-dark bg-dark text-white'
                : 'border-black/15 bg-white text-dark hover:border-dark'
            }`}
          >
            {c.label}
          </button>
        ))}

        <label className="ml-1 flex min-h-[44px] items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Solo disponibles
        </label>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as typeof orden)}
          className="min-h-[44px] rounded-full border border-black/15 bg-white px-4 text-sm"
          aria-label="Ordenar por"
        >
          {ORDEN.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex min-h-[44px] items-center gap-2 rounded-full border border-black/15 px-4 text-neutral-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            className="w-40 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <p className="mb-6 text-sm text-neutral-500">
        {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
      </p>

      <ProductGrid productos={filtrados} />
    </div>
  );
}
