import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Política de Cookies — Jeya Boutique' };

export default function CookiesPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow">Legal</p>
        <h1 className="mb-6 font-heading text-3xl font-semibold text-dark">Política de Cookies</h1>
        <div className="space-y-5 text-sm leading-relaxed text-neutral-600">
          <p>
            Este sitio utiliza cookies técnicas necesarias para el funcionamiento del carrito de
            compras y la sesión de navegación. Estas cookies no requieren consentimiento previo
            porque son esenciales para el servicio.
          </p>
          <p>
            Si en el futuro integramos herramientas de analítica (como Google Analytics) o de
            marketing (como Meta Pixel), se mostrará un banner de consentimiento antes de
            activarlas, en línea con la normativa de protección de datos.
          </p>
          <p>
            Puedes revisar más detalles sobre cómo tratamos tus datos personales en nuestra{' '}
            <Link href="/legal/privacidad" className="underline">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
