import type { Metadata } from 'next';
import type { Categoria } from '@/lib/data-source/types';
import { getShopProducts } from '@/lib/data-source/client';
import ProductFilters from '@/components/shop/ProductFilters';

export const metadata: Metadata = {
  title: 'Catálogo — Jeya Boutique',
  description: 'Explora blusas, chaquetas, zapatos, faldas y bolsos de Jeya Boutique.',
};

const CATEGORIAS_VALIDAS: Categoria[] = ['blusas', 'chaquetas', 'zapatos', 'faldas', 'bolsos'];

export default function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string; buscar?: string };
}) {
  const productos = getShopProducts();
  const categoriaInicial = CATEGORIAS_VALIDAS.includes(searchParams.categoria as Categoria)
    ? (searchParams.categoria as Categoria)
    : 'todos';
  const busquedaInicial = searchParams.buscar ?? '';

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-10 max-w-[60ch] text-center">
          <p className="eyebrow">Catálogo</p>
          <h1 className="mb-2 text-[clamp(1.7rem,3.5vw,2.6rem)] font-semibold text-dark">
            Todo el catálogo Jeya
          </h1>
          <p className="text-neutral-600">
            Filtra por categoría, precio y disponibilidad. Todas las piezas incluyen tallas y
            colores disponibles.
          </p>
        </div>
        <ProductFilters
          productos={productos}
          categoriaInicial={categoriaInicial}
          busquedaInicial={busquedaInicial}
        />
      </div>
    </section>
  );
}
