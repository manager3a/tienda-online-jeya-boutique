'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, calculateSubtotal, clearCart } from '@/lib/cart/store';
import { calculateShippingCost } from '@/lib/shipping/rules';
import { generateOrderId } from '@/lib/orders/order-id';
import { saveOrder } from '@/lib/orders/store';
import type { MetodoEnvio, Pedido } from '@/lib/data-source/types';
import ShippingSelector from './ShippingSelector';
import OrderSummary from './OrderSummary';

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

const initialForm: FormState = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
};

export default function CheckoutForm() {
  const router = useRouter();
  const { items } = useCart();
  const [metodoEnvio, setMetodoEnvio] = useState<MetodoEnvio>('nacional');
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [honeypot, setHoneypot] = useState('');
  const [procesando, setProcesando] = useState(false);

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const costoEnvio = calculateShippingCost(metodoEnvio);

  function handleChange(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.nombre.trim() || form.nombre.trim().length < 3) {
      nextErrors.nombre = 'Ingresa tu nombre completo.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Ingresa un email válido.';
    }
    if (!/^[0-9+\s()-]{7,15}$/.test(form.telefono)) {
      nextErrors.telefono = 'Ingresa un teléfono válido.';
    }
    if (metodoEnvio === 'nacional') {
      if (!form.direccion.trim() || form.direccion.trim().length < 5) {
        nextErrors.direccion = 'Ingresa una dirección de entrega válida.';
      }
      if (!form.ciudad.trim()) {
        nextErrors.ciudad = 'Ingresa tu ciudad.';
      }
      if (!/^[0-9]{5,6}$/.test(form.codigoPostal)) {
        nextErrors.codigoPostal = 'Ingresa un código postal válido (5-6 dígitos).';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot anti-bot: campo oculto que un humano nunca completa.
    // La validación real de reCAPTCHA v3 / rate limiting vive del lado
    // del servidor/automatización (ver docs/automatizacion-n8n.md y
    // SECURITY.md) — aquí solo se documenta el punto de integración.
    if (honeypot) return;

    if (items.length === 0 || !validate()) return;

    setProcesando(true);

    // En producción: aquí se crea la preferencia de pago con el SDK de
    // Mercado Pago (Wallet Brick) y solo se confirma el pedido tras el
    // webhook de pago aprobado. En Fase 2 se simula la confirmación
    // porque el backend de pagos vive fuera de este repo.
    const orderId = generateOrderId();
    const pedido: Pedido = {
      orderId,
      fecha: new Date().toISOString(),
      items,
      subtotal,
      costoEnvio,
      total: subtotal + costoEnvio,
      metodoEnvio,
      estado: 'confirmado',
      comprador: {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        ...(metodoEnvio === 'nacional'
          ? {
              direccion: form.direccion.trim(),
              ciudad: form.ciudad.trim(),
              codigoPostal: form.codigoPostal.trim(),
            }
          : {}),
      },
    };

    saveOrder(pedido);
    clearCart();
    router.push(`/confirmacion/${encodeURIComponent(orderId)}`);
  }

  if (items.length === 0) {
    return (
      <p className="rounded-sm bg-surface-alt p-6 text-center text-neutral-600">
        Tu carrito está vacío. Agrega productos antes de finalizar la compra.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-8">
        <fieldset>
          <legend className="mb-4 font-heading text-xl font-semibold text-dark">
            Datos de contacto
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre completo"
              error={errors.nombre}
              input={
                <input
                  className="input-field"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  autoComplete="name"
                  required
                />
              }
            />
            <Field
              label="Email"
              error={errors.email}
              input={
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  autoComplete="email"
                  required
                />
              }
            />
            <Field
              label="Teléfono"
              error={errors.telefono}
              input={
                <input
                  type="tel"
                  className="input-field"
                  value={form.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  autoComplete="tel"
                  required
                />
              }
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 font-heading text-xl font-semibold text-dark">
            Método de envío
          </legend>
          <ShippingSelector value={metodoEnvio} onChange={setMetodoEnvio} />
        </fieldset>

        {metodoEnvio === 'nacional' && (
          <fieldset>
            <legend className="mb-4 font-heading text-xl font-semibold text-dark">
              Dirección de entrega
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Dirección"
                  error={errors.direccion}
                  input={
                    <input
                      className="input-field"
                      value={form.direccion}
                      onChange={(e) => handleChange('direccion', e.target.value)}
                      autoComplete="street-address"
                      required
                    />
                  }
                />
              </div>
              <Field
                label="Ciudad"
                error={errors.ciudad}
                input={
                  <input
                    className="input-field"
                    value={form.ciudad}
                    onChange={(e) => handleChange('ciudad', e.target.value)}
                    autoComplete="address-level2"
                    required
                  />
                }
              />
              <Field
                label="Código postal"
                error={errors.codigoPostal}
                input={
                  <input
                    className="input-field"
                    value={form.codigoPostal}
                    onChange={(e) => handleChange('codigoPostal', e.target.value)}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    required
                  />
                }
              />
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="mb-4 font-heading text-xl font-semibold text-dark">
            Método de pago
          </legend>
          <div className="rounded-sm border border-black/15 p-4">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Pago seguro con Mercado Pago
            </p>
            <p className="text-xs text-neutral-500">
              Tarjetas, PSE y Nequi. Serás redirigida al checkout oficial de Mercado Pago para
              ingresar los datos de pago — Jeya Boutique nunca almacena datos de tu tarjeta.
            </p>
          </div>
        </fieldset>

        {/* Honeypot anti-bot: invisible para personas, atractivo para bots. */}
        <input
          type="text"
          name="empresa"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <button type="submit" disabled={procesando} className="btn-primary w-full sm:w-auto">
          {procesando ? 'Procesando…' : 'Confirmar y pagar'}
        </button>
      </div>

      <OrderSummary items={items} subtotal={subtotal} costoEnvio={costoEnvio} />
    </form>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-dark">{label}</span>
      {input}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
