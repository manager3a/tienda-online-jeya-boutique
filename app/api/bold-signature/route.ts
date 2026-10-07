import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Firma de integridad del Botón de Pagos de Bold. Algoritmo confirmado
 * contra el plugin oficial de Bold para WordPress/WooCommerce
 * (BoldButtonBlock.php): sha256(orderReference + amount + currency + secretKey).
 * El secretKey NUNCA debe llegar al cliente — por eso este cálculo vive
 * en una ruta de servidor y no en el componente del botón.
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.BOLD_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ ok: false, error: 'Bold no está configurado' }, { status: 503 });
  }

  const { orderReference, amount, currency } = await req.json();
  if (!orderReference || !amount || !currency) {
    return NextResponse.json({ ok: false, error: 'Datos incompletos' }, { status: 400 });
  }

  const signature = createHash('sha256')
    .update(`${orderReference}${amount}${currency}${secretKey}`)
    .digest('hex');

  return NextResponse.json({ ok: true, signature });
}
