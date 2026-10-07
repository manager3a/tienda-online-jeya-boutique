import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Pedido } from '@/lib/data-source/types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function buildOrderEmailHtml(pedido: Pedido): string {
  const filas = pedido.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0;">${escapeHtml(item.talla)} / ${escapeHtml(item.color)} × ${item.cantidad}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:sans-serif;color:#151716;">
      <h2>¡Gracias por tu compra, ${escapeHtml(pedido.comprador.nombre)}!</h2>
      <p>Tu pedido <strong>${escapeHtml(pedido.orderId)}</strong> fue confirmado.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">${filas}</table>
      <p><strong>Total: ${formatoCOP.format(pedido.total)}</strong></p>
      <p>Te avisaremos cuando tu pedido esté en camino.</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Resend no está configurado' });
  }

  const pedido = (await req.json()) as Pedido;
  if (!pedido?.comprador?.email || !pedido?.orderId) {
    return NextResponse.json({ ok: false, error: 'Pedido inválido' }, { status: 400 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'pedidos@jeyaboutique.com',
      to: pedido.comprador.email,
      subject: `Confirmación de tu pedido ${pedido.orderId} — Jeya Boutique`,
      html: buildOrderEmailHtml(pedido),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[enviar-confirmacion] Error al enviar con Resend:', error);
    return NextResponse.json({ ok: false });
  }
}
