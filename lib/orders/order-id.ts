/**
 * Genera un número de pedido único con formato #ORD-YYYYMMDD-XXXX.
 * El sufijo aleatorio se genera con crypto cuando está disponible
 * (navegador o Node moderno) y cae a Math.random solo como respaldo.
 */
export function generateOrderId(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  let suffix: string;
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    suffix = String(arr[0] % 10000).padStart(4, '0');
  } else {
    suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  }

  return `#ORD-${yyyy}${mm}${dd}-${suffix}`;
}
