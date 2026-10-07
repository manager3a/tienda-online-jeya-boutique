'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renderiza el botón oficial de pagos de Bold. Pide primero la firma de
 * integridad al servidor (app/api/bold-signature) — el secretKey nunca
 * llega aquí — y luego inyecta el script público de Bold con los datos
 * de la transacción.
 *
 * Nota: el src del script y los nombres exactos de los atributos
 * data-* deben confirmarse contra el snippet real del dashboard de Bold
 * o su documentación pública antes de producción; no fue posible
 * verificarlos en vivo desde este entorno (sin acceso de red a bold.co).
 * El algoritmo de firma sí está confirmado contra el plugin oficial de
 * Bold para WooCommerce que el cliente proporcionó.
 */
export default function BoldPaymentButton({
  orderReference,
  amount,
  currency,
  description,
  redirectionUrl,
}: {
  orderReference: string;
  amount: number;
  currency: string;
  description?: string;
  redirectionUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setSignature(null);
    setError(false);
    fetch('/api/bold-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderReference, amount, currency }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setSignature(data.signature);
        else setError(true);
      })
      .catch((e) => {
        console.error('[bold] No se pudo obtener la firma de integridad:', e);
        setError(true);
      });
  }, [orderReference, amount, currency]);

  useEffect(() => {
    const container = containerRef.current;
    if (!signature || !container) return;

    const apiKey = process.env.NEXT_PUBLIC_BOLD_API_KEY;
    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.setAttribute('data-bold-button', '');
    script.setAttribute('data-api-key', apiKey ?? '');
    script.setAttribute('data-amount', String(amount));
    script.setAttribute('data-currency', currency);
    script.setAttribute('data-order-id', orderReference);
    script.setAttribute('data-integrity-signature', signature);
    script.setAttribute('data-redirection-url', redirectionUrl);
    if (description) script.setAttribute('data-description', description);
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [signature, amount, currency, orderReference, redirectionUrl, description]);

  if (!process.env.NEXT_PUBLIC_BOLD_API_KEY) {
    return null;
  }

  return (
    <div>
      <div ref={containerRef} />
      {error && (
        <p className="text-xs text-red-600">
          No pudimos cargar el botón de Bold. Intenta de nuevo o usa Mercado Pago.
        </p>
      )}
    </div>
  );
}
