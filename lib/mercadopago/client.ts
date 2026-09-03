/**
 * Inicialización del SDK público de Mercado Pago (checkout embebido / Wallet
 * Brick). Solo usa la clave PÚBLICA (NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) —
 * la clave privada de Mercado Pago NUNCA debe vivir en el frontend; vive
 * como variable de entorno del lado del servidor donde se cree la
 * preferencia de pago (fuera de este repo estático, en la función/
 * automatización que Cognit configure — ver docs/automatizacion-n8n.md).
 */

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => unknown;
  }
}

const MP_SDK_URL = 'https://sdk.mercadopago.com/js/v2';

export function getMercadoPagoPublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
}

let sdkPromise: Promise<void> | null = null;

export function loadMercadoPagoSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.MercadoPago) {
    return Promise.resolve();
  }
  if (sdkPromise) {
    return sdkPromise;
  }
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = MP_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago'));
    document.head.appendChild(script);
  });
  return sdkPromise;
}
