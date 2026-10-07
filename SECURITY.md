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

## Cuentas de usuario (Fase 3 → Supabase Auth)

- [x] `lib/auth/store.ts` usa **Supabase Auth** real (email + contraseña):
      registro, login, sesión persistida y cierre de sesión. Supabase
      envía automáticamente el correo de confirmación al registrarse — no
      requiere backend ni servicio de email propio.
- [x] `lib/supabase/client.ts` solo usa la clave **publishable/anon**
      (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), diseñada para exponerse en el
      frontend y protegida por Row Level Security. La clave
      **`service_role`/`secret`** de Supabase NUNCA debe usarse aquí ni
      en ningún código que llegue al navegador — solo en backend/n8n.
- [ ] Contraseñas: Supabase exige mínimo 6 caracteres por defecto: para
      un e-commerce real, subir ese mínimo y activar protección contra
      contraseñas filtradas en Supabase → Authentication → Policies.
- [ ] Configurar en el dashboard de Supabase (Authentication → URL
      Configuration) el **Site URL** y **Redirect URLs** apuntando al
      dominio real de producción (`https://tienda-online-jeya-boutique.vercel.app`
      y el dominio final si cambia) — si no, el link del correo de
      confirmación redirige a `localhost`.
- [ ] Nombre, apellido, país, teléfono y fecha de nacimiento se guardan
      como `user_metadata` de Supabase Auth (no hay tabla propia todavía).
      Si más adelante se necesita consultarlos desde otras partes del
      sistema (ej. el conector de n8n), crear una tabla `profiles` con
      RLS (`auth.uid() = id`) en vez de leer `user_metadata` directamente.
- [ ] El popup de bienvenida (`components/shop/WelcomePopup.tsx`) sigue
      siendo un mock en `localStorage` — es solo un lead de marketing
      (correo, celular, fecha de nacimiento), no crea una cuenta. Antes de
      producción, decidir si esos leads también deben ir a Supabase (tabla
      `leads` con política de inserción pública y lectura solo para el
      equipo de Jeya).

## Pendiente antes de producción (fuera del alcance de este repo)

- [ ] Cuenta y credenciales reales de Mercado Pago (modo producción).
- [ ] Workflow de n8n desplegado según `docs/automatizacion-n8n.md`.
- [ ] Clave real de reCAPTCHA v3.
- [ ] Backend real de pedidos (hoy simulado en `localStorage` del
      comprador para la Fase 2).
- [x] Backend real de autenticación de usuarios — resuelto con Supabase
      Auth (ver sección "Cuentas de usuario" arriba). Pendiente: configurar
      Site URL/Redirect URLs en el dashboard de Supabase y agregar las dos
      variables `NEXT_PUBLIC_SUPABASE_*` en Vercel → Project Settings →
      Environment Variables.
- [ ] Logos oficiales de medios de pago: `components/layout/PaymentLogos.tsx`
      usa wordmarks recreados en SVG (vectoriales, nítidos a cualquier
      tamaño) porque este entorno no tuvo acceso a los archivos de marca
      oficiales — reemplazar por los assets reales cuando el cliente o
      cada pasarela los facilite.
