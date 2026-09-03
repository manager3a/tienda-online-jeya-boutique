import type { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'Finalizar compra — Jeya Boutique',
};

export default function CheckoutPage() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-5">
        <p className="eyebrow">Checkout</p>
        <h1 className="mb-8 font-heading text-3xl font-semibold text-dark">Finalizar compra</h1>
        <CheckoutForm />
      </div>
    </section>
  );
}
