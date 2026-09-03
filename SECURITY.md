# Checklist de seguridad — Jeya Boutique (Fase 2, método Cognit)

Equivalente al bloque de comentarios de seguridad del estándar Cognit,
adaptado a una app Next.js (no aplica insertarlo como comentario HTML al
final de un único archivo, como en un sitio estático).

## General

- [ ] Configurar en Vercel los headers de seguridad documentados en
      `app/layout.tsx`: `Content-Security-Policy`, `X-Frame-Options: DENY`,
      `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- [ ] HTTPS forzado (por defecto en Vercel) con redirección 301 desde HTTP.
- [ ] Ningún recurso (imágenes, scripts, fuentes) cargado por `http://`.
- [ ] Sin `innerHTML` ni `dangerouslySetInnerHTML` con datos de usuario o
      de fuentes externas en ningún componente.
- [ ] Sin claves privadas, tokens ni credenciales hardcodeadas en el
      código del repositorio — todo vive en variables de entorno
      (`.env.example` documenta cuáles) o en las credenciales de n8n.
- [ ] Backups automáticos del repositorio (GitHub) y del Google Sheet
      fuente del catálogo.

## E-commerce

- [ ] Carrito (`lib/cart/store.ts`) guarda solo `productId` + variante +
      cantidad en `localStorage` — nunca precios ni totales.
- [ ] Subtotal, envío y total siempre recalculados desde
      `lib/data-source/client.ts` y `lib/shipping/rules.ts`
      (`calculateSubtotal`, `calculateShippingCost`), nunca desde un valor
      que el navegador tuviera guardado.
- [ ] Checkout (`components/checkout/CheckoutForm.tsx`) valida todos los
      campos en el cliente antes de enviar.
- [ ] Honeypot anti-bot activo en el formulario de checkout. Pendiente:
      reemplazar por reCAPTCHA v3 real cuando el cliente tenga cuenta de
      Google reCAPTCHA (clave en `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`).
- [ ] Rate limiting (máx. 5 intentos/IP/hora) en el endpoint que cree la
      preferencia de pago de Mercado Pago — se implementa en el
      servidor/automatización, no en este repositorio estático.
- [ ] Ningún dato de tarjeta se captura fuera del SDK oficial de Mercado
      Pago (`lib/mercadopago/client.ts` solo carga el SDK público).
- [ ] Checkout indica visualmente "Compra 100% segura" (ver
      `CheckoutForm.tsx` y `OrderSummary.tsx`).
- [ ] Páginas legales presentes y enlazadas en el footer: Privacidad y
      Cookies, Términos y Condiciones de Compra, Política de Envíos.
- [ ] Cumplir PCI-DSS: no aplica directamente porque Jeya Boutique nunca
      procesa datos de tarjeta — los recibe y procesa Mercado Pago.

## Pendiente antes de producción (fuera del alcance de este repo)

- [ ] Cuenta y credenciales reales de Mercado Pago (modo producción).
- [ ] Workflow de n8n desplegado según `docs/automatizacion-n8n.md`.
- [ ] Clave real de reCAPTCHA v3.
- [ ] Backend real de pedidos (hoy simulado en `localStorage` del
      comprador para la Fase 2).
