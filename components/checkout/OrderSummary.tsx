import type { ItemCarrito } from '@/lib/data-source/types';
import { getProductById } from '@/lib/data-source/client';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function OrderSummary({
  items,
  subtotal,
  costoEnvio,
}: {
  items: ItemCarrito[];
  subtotal: number;
  costoEnvio: number;
}) {
  const total = subtotal + costoEnvio;

  return (
    <aside className="h-fit rounded-md bg-surface-alt p-6">
      <h2 className="mb-4 font-heading text-xl font-semibold text-dark">Resumen del pedido</h2>
      <ul className="mb-4 space-y-3 text-sm">
        {items.map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return (
            <li key={`${item.productId}-${item.talla}-${item.color}`} className="flex justify-between">
              <span className="text-neutral-600">
                {product.nombre} × {item.cantidad}{' '}
                <span className="text-xs text-neutral-400">
                  ({item.talla}, {item.color})
                </span>
              </span>
              <span className="font-medium text-dark">
                {formatoCOP.format(product.precio * item.cantidad)}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-black/10 pt-3 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>{formatoCOP.format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Envío</span>
          <span>{costoEnvio === 0 ? 'Gratis' : formatoCOP.format(costoEnvio)}</span>
        </div>
        <div className="flex justify-between pt-2 text-base font-bold text-dark">
          <span>Total</span>
          <span>{formatoCOP.format(total)}</span>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Compra 100% segura con Mercado Pago
      </p>
    </aside>
  );
}
