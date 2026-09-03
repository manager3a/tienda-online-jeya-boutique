import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug } from '@/lib/data-source/client';
import ProductVariantForm from '@/components/shop/ProductVariantForm';
import ProductGrid from '@/components/shop/ProductGrid';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const producto = getProductBySlug(params.slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} — Jeya Boutique`,
    description: producto.descripcion,
  };
}

export default function ProductoDetallePage({ params }: { params: { slug: string } }) {
  const producto = getProductBySlug(params.slug);
  if (!producto) notFound();

  const relacionados = getAllProducts()
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-5">
        <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-neutral-500">
          <Link href="/productos" className="hover:underline">
            Catálogo
          </Link>{' '}
          / <span className="capitalize">{producto.categoria}</span> / {producto.nombre}
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-1">
            <div className="relative col-span-4 aspect-[4/5] overflow-hidden rounded-md bg-surface-alt lg:col-span-1">
              <Image
                src={producto.imagenes[0] ?? producto.imagen}
                alt={producto.nombre}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="eyebrow">{producto.categoria}</p>
            <h1 className="mb-3 font-heading text-3xl font-semibold text-dark">{producto.nombre}</h1>
            <p className="mb-5 text-xl font-bold text-dark">
              {formatoCOP.format(producto.precio)}
              {producto.precioOriginal && (
                <span className="ml-3 text-base font-normal text-neutral-400 line-through">
                  {formatoCOP.format(producto.precioOriginal)}
                </span>
              )}
            </p>
            <p className="mb-8 text-neutral-600">{producto.descripcion}</p>

            <ProductVariantForm producto={producto} />

            <div className="mt-8 space-y-2 border-t border-black/10 pt-6 text-sm text-neutral-500">
              <p>🚚 Envío nacional 3-6 días hábiles o recogida gratuita en Bogotá.</p>
              <p>🔒 Compra 100% segura con Mercado Pago.</p>
              <p>↩︎ Cambios y devoluciones dentro de los primeros 10 días.</p>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-dark">
              También te puede interesar
            </h2>
            <ProductGrid productos={relacionados} />
          </div>
        )}
      </div>
    </section>
  );
}
