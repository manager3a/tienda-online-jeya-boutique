import type { Metadata } from 'next';
import { Cormorant, Montserrat } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jeya Boutique — Moda con exclusividad',
  description:
    'Jeya Boutique — Blusas, chaquetas, zapatos, faldas y bolsos con exclusividad, asesoría personalizada y estilo moderno. Bogotá, Colombia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/*
          SEGURIDAD: configurar estos headers en el servidor/hosting (Vercel):
          Content-Security-Policy: default-src 'self'; img-src 'self' https://placehold.co data:; script-src 'self' https://sdk.mercadopago.com; connect-src 'self' https://api.mercadopago.com; frame-src https://www.mercadopago.com.co
          X-Frame-Options: DENY
          Referrer-Policy: strict-origin-when-cross-origin
          Permissions-Policy: geolocation=(), microphone=(), camera=()
          Strict-Transport-Security: max-age=31536000
        */}
      </head>
      <body className="bg-bg font-body text-[#1c1e1d] antialiased">
        <a
          href="#main"
          className="skip-link fixed left-4 top-4 z-[999] -translate-y-24 rounded-sm bg-accent px-4 py-3 text-dark focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
