'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  pais: string;
  telefono: string;
  fechaNacimiento: string; // YYYY-MM-DD
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  pais: string;
  telefono: string;
  fechaNacimiento: string;
}

function mapUser(user: User | null): Usuario | null {
  if (!user) return null;
  const meta = (user.user_metadata ?? {}) as Partial<DatosRegistro>;
  return {
    id: user.id,
    email: user.email ?? '',
    nombre: meta.nombre ?? '',
    apellido: meta.apellido ?? '',
    pais: meta.pais ?? '',
    telefono: meta.telefono ?? '',
    fechaNacimiento: meta.fechaNacimiento ?? '',
  };
}

type AuthResult = { ok: true; needsEmailConfirmation?: boolean } | { ok: false; error: string };

/**
 * Autenticación real con Supabase Auth (email + contraseña). Supabase
 * envía el correo de confirmación automáticamente al registrarse — no
 * requiere backend ni servicio de email propio. Ver SECURITY.md para la
 * configuración pendiente en el dashboard de Supabase (Site URL, política
 * de RLS si se agregan tablas de perfil más adelante).
 */
export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(mapUser(data.session?.user ?? null));
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function registerUser(datos: DatosRegistro): Promise<AuthResult> {
    if (!supabase) return { ok: false, error: 'Supabase no está configurado todavía.' };
    const { data, error } = await supabase.auth.signUp({
      email: datos.email,
      password: datos.password,
      options: {
        data: {
          nombre: datos.nombre,
          apellido: datos.apellido,
          pais: datos.pais,
          telefono: datos.telefono,
          fechaNacimiento: datos.fechaNacimiento,
        },
      },
    });
    if (error) return { ok: false, error: error.message };
    // Con confirmación de correo activada, Supabase no entrega una sesión
    // hasta que se confirme el email (identities vacío = correo ya existía).
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { ok: false, error: 'Ya existe una cuenta registrada con ese correo.' };
    }
    return { ok: true, needsEmailConfirmation: !data.session };
  }

  async function loginUser(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { ok: false, error: 'Supabase no está configurado todavía.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function logoutUser() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function loginWithGoogle(): Promise<AuthResult> {
    if (!supabase) return { ok: false, error: 'Supabase no está configurado todavía.' };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { ok: false, error: error.message };
    // signInWithOAuth redirige el navegador a Google — no hay nada más
    // que hacer aquí, la sesión se completa al volver del redirect.
    return { ok: true };
  }

  return {
    user,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    loginWithGoogle,
    configured: isSupabaseConfigured(),
  };
}
