'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBox({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/productos?buscar=${encodeURIComponent(q)}` : '/productos');
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscar en la tienda"
      className={`flex w-full items-center overflow-hidden rounded-full border border-black/15 bg-white ${className}`}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca un artículo…"
        aria-label="Busca un artículo"
        className="h-11 w-full bg-transparent px-4 text-sm outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="flex h-11 w-12 flex-shrink-0 items-center justify-center bg-accent text-dark transition-colors hover:bg-accent-dark hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}
