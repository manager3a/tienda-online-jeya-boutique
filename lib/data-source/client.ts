import type { Producto } from './types';
import mockProducts from './mock-products.json';

/**
 * Punto único de lectura del catálogo. En producción, el mismo contrato
 * (Producto[]) lo llena el conector n8n leyendo el Google Sheet del
 * cliente (ver docs/automatizacion-n8n.md) — el resto de la app nunca
 * necesita saber de dónde vinieron los datos.
 */
export function getAllProducts(): Producto[] {
  return mockProducts as Producto[];
}

/** Catálogo de ropa/accesorios, sin las tarjetas de regalo (tienen su propia página en /tarjetas). */
export function getShopProducts(): Producto[] {
  return getAllProducts().filter((p) => p.categoria !== 'tarjetas');
}

export function getGiftCards(): Producto[] {
  return getAllProducts().filter((p) => p.categoria === 'tarjetas');
}

export function getProductBySlug(slug: string): Producto | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Producto | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductsByCategory(categoria: string): Producto[] {
  if (categoria === 'todos') return getAllProducts();
  return getAllProducts().filter((p) => p.categoria === categoria);
}
