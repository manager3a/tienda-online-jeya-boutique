import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase para el navegador. Solo usa la clave pública
 * (publishable/anon) — nunca la clave secreta (service_role), que debe
 * vivir únicamente en el servidor/automatización y jamás en código que se
 * envía al cliente (ver SECURITY.md).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
