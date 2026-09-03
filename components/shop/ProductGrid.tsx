'use client';

import { useState } from 'react';
import type { Producto } from '@/lib/data-source/types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductGrid({ productos }: { productos: Producto[] }) {
  const [vistaRapida, setVistaRapida] = useState<Producto | null>(null);

  if (productos.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-neutral-500">
        No encontramos productos con ese filtro. Prueba con otra categoría o búsqueda.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} onQuickView={setVistaRapida} />
        ))}
      </div>
      {vistaRapida && <ProductModal producto={vistaRapida} onClose={() => setVistaRapida(null)} />}
    </>
  );
}
