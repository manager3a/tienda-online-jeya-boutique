'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/lib/cart/store';
import { useAuth, type Usuario } from '@/lib/auth/store';
import CartDrawer from '@/components/shop/CartDrawer';
import SearchBox from './SearchBox';
import AuthModal from '@/components/auth/AuthModal';

const CATEGORIAS = [
  { label: 'Catálogo', href: '/productos' },
  { label: 'Blusas', href: '/productos?categoria=blusas' },
  { label: 'Chaquetas', href: '/productos?categoria=chaquetas' },
  { label: 'Zapatos', href: '/productos?categoria=zapatos' },
  { label: 'Faldas', href: '/productos?categoria=faldas' },
  { label: 'Bolsos', href: '/productos?categoria=bolsos' },
  { label: 'Regala una tarjeta', href: '/tarjetas' },
  { label: 'Seguimiento de pedido', href: '/seguimiento' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { count } = useCart();
  const { user, logoutUser } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo-jeya.jpg"
              alt="Jeya Boutique"
              width={64}
              height={64}
              priority
              className="h-[57px] w-[57px] rounded-full object-cover"
            />
          </Link>

          <nav aria-label="Menú principal" className="hidden lg:flex lg:items-center lg:gap-6">
            <ul className="flex items-center gap-6">
              {CATEGORIAS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <AccountButton user={user} onLoginClick={() => setAuthOpen(true)} onLogout={logoutUser} />
            <CartButton count={count} onClick={() => setCartOpen(true)} />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <AccountButton user={user} onLoginClick={() => setAuthOpen(true)} onLogout={logoutUser} />
            <CartButton count={count} onClick={() => setCartOpen(true)} />
            <button
              type="button"
              className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center gap-1.5"
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

        <div className="border-t border-black/5 px-5 py-2.5">
          <div className="mx-auto max-w-xl">
            <SearchBox />
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
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
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

function AccountButton({
  user,
  onLoginClick,
  onLogout,
}: {
  user?: Usuario | null;
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <button
        type="button"
        onClick={onLoginClick}
        className="inline-flex h-11 w-11 items-center justify-center"
        aria-label="Iniciar sesión o registrarse"
        title="Iniciar sesión o registrarse"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-2 px-1"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Cuenta de ${user.nombre}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        <span className="hidden text-sm font-medium text-dark sm:inline">{user.nombre}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-md border border-black/10 bg-surface shadow-card"
        >
          <Link
            href="/cuenta"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm text-dark hover:bg-surface-alt"
          >
            Mi perfil
          </Link>
          <Link
            href="/cuenta/pedidos"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm text-dark hover:bg-surface-alt"
          >
            Mis compras
          </Link>
          <Link
            href="/cuenta/favoritos"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm text-dark hover:bg-surface-alt"
          >
            Mis favoritos
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="block w-full px-4 py-3 text-left text-sm text-dark hover:bg-surface-alt"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
