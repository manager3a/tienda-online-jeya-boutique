import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-[#d9dbda]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-heading text-2xl font-bold text-white">jeya</span>
            <span className="text-[0.6rem] tracking-[0.28em] text-accent-dark">BOUTIQUE</span>
          </Link>
          <p className="mt-4 max-w-[32ch] text-sm text-[#9ea3a1]">
            Moda y diseño con exclusividad, atención personalizada y asesoramiento.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.instagram.com/jeya_boutique/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Jeya Boutique"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a
              href="https://www.threads.com/@jeya_boutique"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads de Jeya Boutique"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M12 3c4.5 0 7 2.6 7 6.4 0 3-1.6 4.4-3.6 4.4-1.4 0-2.2-.7-2.4-1.7-.6 1.1-1.7 1.8-3.2 1.8-2.1 0-3.5-1.4-3.5-3.4 0-2.2 1.7-3.7 4.2-3.7.8 0 1.5.1 2 .4 0-1.1-.7-1.8-2-1.8-1 0-1.8.3-2.5.9L6.8 5c1-1.2 2.7-2 5.2-2Zm.2 6.4c-1.2 0-1.9.6-1.9 1.5 0 .8.6 1.3 1.6 1.3 1.2 0 2-.8 2.1-2.2-.5-.4-1.1-.6-1.8-.6ZM5 15.5C5 19.6 8 21 12.1 21c3.6 0 6.1-1.1 6.8-3.6" />
              </svg>
            </a>
          </div>
        </div>

        <FooterCol
          title="Tienda"
          links={[
            { label: 'Catálogo', href: '/productos' },
            { label: 'Carrito', href: '/carrito' },
            { label: 'Seguimiento de pedido', href: '/seguimiento' },
            { label: 'Finalizar compra', href: '/checkout' },
          ]}
        />
        <FooterCol
          title="Políticas"
          links={[
            { label: 'Política de devoluciones', href: '/legal/terminos' },
            { label: 'Términos y condiciones de compra', href: '/legal/terminos' },
            { label: 'Política de envíos', href: '/legal/envios' },
            { label: 'Política de privacidad y cookies', href: '/legal/privacidad' },
          ]}
        />

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">Contacto</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-[#b7bbb9]">
            <li>
              <a href="mailto:yanisnajar@hotmail.com" className="transition-colors hover:text-accent">
                yanisnajar@hotmail.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/573015794089"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                +57 301 579 4089
              </a>
            </li>
            <li>Carrera 8H #164C-13, Bogotá</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Visa', 'Mastercard', 'PSE', 'Nequi', 'Mercado Pago'].map((m) => (
              <span key={m} className="rounded border border-white/25 px-2 py-1 text-[0.7rem] text-[#cfd2d1]">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-5 text-xs text-[#8b908e]">
          <p>© {new Date().getFullYear()} Jeya Boutique. Todos los derechos reservados.</p>
          <p>Compra 100% segura · Checkout con Mercado Pago</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">{title}</h3>
      <ul className="flex flex-col gap-2.5 text-sm text-[#b7bbb9]">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
