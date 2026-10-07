import type { Metadata } from 'next';
import { getGiftCards } from '@/lib/data-source/client';
import GiftCardTile from '@/components/shop/GiftCardTile';

export const metadata: Metadata = {
  title: 'Regala una tarjeta — Jeya Boutique',
  description: 'Tarjetas de regalo Jeya Boutique: Bronce, Plata y Dorada.',
};

export default function TarjetasPage() {
  const tarjetas = getGiftCards();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <p className="eyebrow">Regala una tarjeta</p>
        <h1 className="mb-3 font-heading text-3xl font-bold text-dark">
          El regalo perfecto, a su manera
        </h1>
        <p className="mx-auto mb-12 max-w-[55ch] text-neutral-600">
          Elige el valor que quieras regalar y deja que ella escoja su pieza favorita. Se agrega
          al carrito igual que cualquier producto y se entrega por email tras la compra.
        </p>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {tarjetas.map((t) => (
            <GiftCardTile key={t.id} producto={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
