import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data-source/client';
import ProductGrid from '@/components/shop/ProductGrid';

const BENEFICIOS = [
  'Asesoramiento personalizado',
  'Piezas exclusivas y limitadas',
  'Envíos a toda Colombia',
  'Soporte por WhatsApp y chat',
];

export default function HomePage() {
  const destacados = getAllProducts().slice(0, 4);

  return (
    <>
      <section className="py-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow">Nueva colección · Moda y diseño</p>
            <h1 className="mb-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.1] text-dark">
              Exclusividad que se nota en cada detalle
            </h1>
            <p className="mb-6 max-w-[46ch] text-[1.05rem] text-neutral-600">
              Blusas, chaquetas, zapatos, faldas y bolsos seleccionados para la mujer que
              busca piezas con carácter y asesoría personalizada, no solo ropa de closet.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/productos" className="btn-primary">
                Ver productos
              </Link>
              <a
                href="https://wa.me/573015794089"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Asesoría por WhatsApp
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
              <li>— Atención personalizada</li>
              <li>— Piezas exclusivas</li>
              <li>— Envíos desde Bogotá</li>
            </ul>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-card">
              <Image
                src="https://placehold.co/640x760/151716/38c2bc?text=Jeya+Boutique"
                alt="Colección Jeya Boutique"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 flex flex-col gap-1 rounded-md bg-dark px-5 py-4 text-white">
              <span className="text-xs">Colección</span>
              <strong className="font-heading text-lg text-accent">Nueva temporada</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-2 px-5 text-[0.82rem] text-accent">
          {BENEFICIOS.map((b) => (
            <span key={b} className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M20 7 9 18l-5-5" />
              </svg>
              {b}
            </span>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto mb-10 max-w-[60ch] text-center">
            <p className="eyebrow">Catálogo</p>
            <h2 className="mb-2 text-[clamp(1.7rem,3.5vw,2.6rem)] font-semibold text-dark">
              Lo más reciente de la colección
            </h2>
            <p className="text-neutral-600">
              Explora por categoría, precio y disponibilidad. Cada pieza incluye tallas y
              colores disponibles.
            </p>
          </div>
          <ProductGrid productos={destacados} />
          <div className="mt-10 text-center">
            <Link href="/productos" className="btn-outline">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="https://placehold.co/560x420/38c2bc/151716?text=Jeya"
              alt="Atención personalizada Jeya Boutique"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Por qué Jeya</p>
            <h2 className="mb-4 text-[clamp(1.7rem,3.5vw,2.6rem)] font-semibold text-dark">
              Moda pensada para acompañarte, no solo para vestirte
            </h2>
            <p className="mb-6 text-neutral-600">
              En Jeya Boutique creemos en la exclusividad bien entendida: piezas cuidadosamente
              seleccionadas, disponibilidad limitada y un equipo que te asesora antes, durante
              y después de tu compra. Confianza, calidez y creatividad en cada conversación.
            </p>
            <a
              href="https://wa.me/573015794089"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline self-start"
            >
              Habla con nosotras por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
