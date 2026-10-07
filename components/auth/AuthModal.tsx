'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/store';
import { PAISES } from '@/lib/countries';

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  pais: string;
  telefono: string;
  dia: string;
  mes: string;
  anio: string;
}

const initialForm: FormState = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  pais: PAISES[0].code,
  telefono: '',
  dia: '',
  mes: '',
  anio: '',
};

/** Traduce los mensajes más comunes de Supabase Auth; el resto se muestra tal cual. */
function traducirError(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (m.includes('email not confirmed')) return 'Confirma tu correo antes de iniciar sesión — revisa tu bandeja de entrada.';
  if (m.includes('user already registered') || m.includes('already registered')) {
    return 'Ya existe una cuenta registrada con ese correo.';
  }
  if (m.includes('password') && m.includes('6')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (m.includes('rate limit')) return 'Demasiados intentos. Intenta de nuevo en unos minutos.';
  if (m.includes('failed to fetch') || m.includes('network')) {
    return 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
  }
  return mensaje;
}

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, registerUser, loginUser, logoutUser, loginWithGoogle, configured } = useAuth();
  const [modo, setModo] = useState<'login' | 'registro'>('registro');
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviandoGoogle, setEnviandoGoogle] = useState(false);
  const [confirmacionPendiente, setConfirmacionPendiente] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleChange(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) nextErrors.nombre = 'Ingresa tu nombre.';
    if (!form.apellido.trim()) nextErrors.apellido = 'Ingresa tu apellido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Email inválido.';
    if (form.password.length < 6) nextErrors.password = 'Mínimo 6 caracteres.';
    if (!/^[0-9]{7,12}$/.test(form.telefono)) nextErrors.telefono = 'Celular inválido.';
    const dia = Number(form.dia);
    const mes = Number(form.mes);
    const anio = Number(form.anio);
    if (!dia || !mes || !anio || anio < 1920 || anio > new Date().getFullYear() - 13) {
      nextErrors.anio = 'Fecha de nacimiento inválida.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    const pais = PAISES.find((p) => p.code === form.pais) ?? PAISES[0];
    const fechaNacimiento = `${form.anio}-${form.mes.padStart(2, '0')}-${form.dia.padStart(2, '0')}`;

    setEnviando(true);
    const result = await registerUser({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      password: form.password,
      pais: pais.code,
      telefono: `${pais.dial} ${form.telefono.trim()}`,
      fechaNacimiento,
    });
    setEnviando(false);

    if (!result.ok) {
      setFormError(traducirError(result.error));
      return;
    }
    if (result.needsEmailConfirmation) {
      setConfirmacionPendiente(true);
      return;
    }
    setForm(initialForm);
    onClose();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setEnviando(true);
    const result = await loginUser(form.email, form.password);
    setEnviando(false);
    if (!result.ok) {
      setFormError(traducirError(result.error));
      return;
    }
    setForm(initialForm);
    onClose();
  }

  function closeAndReset() {
    setConfirmacionPendiente(false);
    setFormError('');
    setErrors({});
    onClose();
  }

  async function handleGoogleClick() {
    setFormError('');
    setEnviandoGoogle(true);
    const result = await loginWithGoogle();
    setEnviandoGoogle(false);
    if (!result.ok) {
      setFormError(traducirError(result.error));
    }
    // Si fue ok, el navegador ya está siendo redirigido a Google.
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/60" onClick={closeAndReset} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={user ? 'Tu cuenta' : 'Iniciar sesión o registrarse'}
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md bg-surface p-6 shadow-card"
      >
        <button
          type="button"
          onClick={closeAndReset}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-2xl text-dark"
        >
          &times;
        </button>

        {!configured ? (
          <div className="text-center">
            <p className="eyebrow">Cuentas de usuario</p>
            <h2 className="mb-3 font-heading text-xl font-bold text-dark">Aún no disponible</h2>
            <p className="text-sm text-neutral-600">
              Falta configurar las variables de entorno de Supabase
              (<code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)
              en este despliegue.
            </p>
          </div>
        ) : user ? (
          <div className="text-center">
            <p className="eyebrow">Mi cuenta</p>
            <h2 className="mb-2 font-heading text-2xl font-bold text-dark">
              Hola, {user.nombre || user.email} 👋
            </h2>
            <p className="mb-6 text-sm text-neutral-600">{user.email}</p>
            <button type="button" onClick={() => logoutUser()} className="btn-outline w-full">
              Cerrar sesión
            </button>
          </div>
        ) : confirmacionPendiente ? (
          <div className="text-center">
            <span className="mb-3 block text-3xl">📩</span>
            <h2 className="mb-2 font-heading text-xl font-bold text-dark">Revisa tu correo</h2>
            <p className="text-sm text-neutral-600">
              Te enviamos un link de confirmación a <strong>{form.email}</strong>. Ábrelo para
              activar tu cuenta y poder iniciar sesión.
            </p>
          </div>
        ) : (
          <>
            <p className="eyebrow">{modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}</p>
            <h2 className="mb-6 font-heading text-2xl font-bold text-dark">
              {modo === 'registro' ? 'Únete a Jeya Boutique' : 'Bienvenida de nuevo'}
            </h2>

            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={enviandoGoogle}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-sm border border-black/15 bg-white px-4 py-3 text-sm font-medium text-dark transition-colors hover:border-black/30 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.27A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.27v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.37l4-3.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
                />
              </svg>
              {enviandoGoogle ? 'Conectando…' : 'Continuar con Google'}
            </button>

            <div className="mb-4 flex items-center gap-3 text-xs text-neutral-400">
              <span className="h-px flex-1 bg-black/10" />
              o con tu correo
              <span className="h-px flex-1 bg-black/10" />
            </div>

            {modo === 'registro' ? (
              <form onSubmit={handleRegister} noValidate className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre" error={errors.nombre}>
                    <input
                      className="input-field"
                      value={form.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field label="Apellido" error={errors.apellido}>
                    <input
                      className="input-field"
                      value={form.apellido}
                      onChange={(e) => handleChange('apellido', e.target.value)}
                      autoComplete="family-name"
                    />
                  </Field>
                </div>

                <Field label="Correo electrónico" error={errors.email}>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Contraseña" error={errors.password}>
                  <input
                    type="password"
                    className="input-field"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>

                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-dark">País</span>
                    <select
                      className="input-field"
                      value={form.pais}
                      onChange={(e) => handleChange('pais', e.target.value)}
                    >
                      {PAISES.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.flag} {p.dial}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field label="Celular" error={errors.telefono}>
                    <input
                      type="tel"
                      className="input-field"
                      value={form.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      autoComplete="tel-national"
                    />
                  </Field>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-dark">Fecha de nacimiento</span>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      className="input-field"
                      placeholder="DD"
                      inputMode="numeric"
                      maxLength={2}
                      value={form.dia}
                      onChange={(e) => handleChange('dia', e.target.value.replace(/\D/g, ''))}
                    />
                    <input
                      className="input-field"
                      placeholder="MM"
                      inputMode="numeric"
                      maxLength={2}
                      value={form.mes}
                      onChange={(e) => handleChange('mes', e.target.value.replace(/\D/g, ''))}
                    />
                    <input
                      className="input-field"
                      placeholder="AAAA"
                      inputMode="numeric"
                      maxLength={4}
                      value={form.anio}
                      onChange={(e) => handleChange('anio', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  {errors.anio && <span className="mt-1 block text-xs text-red-600">{errors.anio}</span>}
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <button type="submit" disabled={enviando} className="btn-primary w-full">
                  {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>
                <p className="text-center text-xs text-neutral-500">
                  Al registrarte aceptas recibir novedades de Jeya Boutique. Consulta nuestra{' '}
                  <a href="/legal/privacidad" className="underline">
                    Política de privacidad
                  </a>
                  .
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} noValidate className="space-y-4">
                <Field label="Correo electrónico">
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field label="Contraseña">
                  <input
                    type="password"
                    className="input-field"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </Field>
                {formError && <p className="text-sm text-red-600">{formError}</p>}
                <button type="submit" disabled={enviando} className="btn-primary w-full">
                  {enviando ? 'Entrando…' : 'Entrar'}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setModo(modo === 'registro' ? 'login' : 'registro');
                setErrors({});
                setFormError('');
              }}
              className="mt-4 w-full text-center text-sm text-accent-dark underline"
            >
              {modo === 'registro' ? '¿Ya tienes cuenta? Inicia sesión' : '¿Nueva por aquí? Regístrate'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-dark">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
