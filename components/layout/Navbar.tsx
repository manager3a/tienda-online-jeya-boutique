'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart/store';
import CartDrawer from '@/components/shop/CartDrawer';

const CATEGORIAS = [
  { label: 'Catálogo', href: '/productos' },
  { label: 'Blusas', href: '/productos?categoria=blusas' },
  { label: 'Chaquetas', href: '/productos?categoria=chaquetas' },
  { label: 'Zapatos', href: '/productos?categoria=zapatos' },
  { label: 'Faldas', href: '/productos?categoria=faldas' },
  { label: 'Bolsos', href: '/productos?categoria=bolsos' },
  { label: 'Seguimiento de pedido', href: '/seguimiento' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo-jeya.jpg"
              alt="Jeya Boutique"
              width={48}
              height={48}
              priority
              className="h-11 w-11 rounded-full object-cover"
            />
          </Link>

          <nav aria-label="Menú principal" className="hidden lg:flex lg:items-center lg:gap-7">
            <ul className="flex items-center gap-7">
              {CATEGORIAS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <CartButton count={count} onClick={() => setCartOpen(true)} />
            <Link href="/productos" className="btn-primary">
              Ver productos
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <CartButton count={count} onClick={() => setCartOpen(true)} />
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="block h-0.5 w-6 bg-dark" />
              <span className="block h-0.5 w-6 bg-dark" />
              <span className="block h-0.5 w-6 bg-dark" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-30 bg-dark/40 transition-opacity duration-200 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="nav-menu"
        aria-label="Menú principal móvil"
        className={`fixed inset-y-0 right-0 z-30 flex w-full max-w-xs flex-col gap-8 overflow-y-auto bg-bg p-6 pt-24 shadow-card transition-transform duration-300 lg:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-1">
          {CATEGORIAS.map((item) => (
            <li key={item.href} className="border-b border-black/10">
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block min-h-[44px] py-3 text-[1.05rem]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/productos" onClick={() => setMenuOpen(false)} className="btn-primary text-center">
          Ver productos
        </Link>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-11 w-11 items-center justify-center"
      aria-label={`Ver carrito, ${count} productos`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 3h2l2.4 12.4A2 2 0 0 0 9.36 17H18a2 2 0 0 0 2-1.6L21.5 8H6" />
        <circle cx="9.5" cy="21" r="1.4" />
        <circle cx="17.5" cy="21" r="1.4" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-bold text-dark">
        {count}
      </span>
    </button>
  );
}
