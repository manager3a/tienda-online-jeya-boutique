'use client';

import { useFavorites } from '@/lib/favorites/store';
import { getShopProducts } from '@/lib/data-source/client';
import ProductGrid from '@/components/shop/ProductGrid';

export default function MisFavoritosPage() {
  const { favoriteIds } = useFavorites();
  const productos = getShopProducts().filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="mb-8 font-heading text-2xl font-semibold text-dark">Mis favoritos</h1>
      {productos.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Todavía no tienes favoritos. Toca el corazón en cualquier producto para guardarlo aquí.
        </p>
      ) : (
        <ProductGrid productos={productos} />
      )}
    </div>
  );
}
