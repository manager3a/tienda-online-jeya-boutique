-- Tabla de pedidos reales para "Mis compras" (Fase 3, solicitud 07-Oct-2026).
--
-- El agente solo tiene la clave publishable/anon de Supabase y no puede
-- crear tablas ni políticas RLS. Copia y pega este script completo en
-- Supabase → SQL Editor → New query → Run, una sola vez.
--
-- Shape alineado con el tipo `Pedido` de lib/data-source/types.ts.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id text not null unique,
  fecha timestamptz not null default now(),
  items jsonb not null,
  subtotal numeric not null,
  costo_envio numeric not null,
  total numeric not null,
  metodo_envio text not null check (metodo_envio in ('nacional', 'recogida')),
  estado text not null default 'confirmado'
    check (estado in ('confirmado', 'preparando', 'enviado', 'entregado')),
  comprador jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "select own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create index if not exists orders_user_id_idx on public.orders(user_id);
