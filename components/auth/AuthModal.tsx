'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/store';
import { PAISES } from '@/lib/countries';

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
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
  pais: PAISES[0].code,
  telefono: '',
  dia: '',
  mes: '',
  anio: '',
};

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, registerUser, loginByEmail, logoutUser } = useAuth();
  const [modo, setModo] = useState<'login' | 'registro'>('registro');
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loginError, setLoginError] = useState('');

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

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const pais = PAISES.find((p) => p.code === form.pais) ?? PAISES[0];
    const fechaNacimiento = `${form.anio}-${form.mes.padStart(2, '0')}-${form.dia.padStart(2, '0')}`;
    registerUser({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      pais: pais.code,
      telefono: `${pais.dial} ${form.telefono.trim()}`,
      fechaNacimiento,
    });
    setForm(initialForm);
    onClose();
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = loginByEmail(form.email);
    if (!ok) {
      setLoginError('No encontramos una cuenta con ese correo en este navegador. Regístrate primero.');
      return;
    }
    setLoginError('');
    setForm(initialForm);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={user ? 'Tu cuenta' : 'Iniciar sesión o registrarse'}
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md bg-surface p-6 shadow-card"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-2xl text-dark"
        >
          &times;
        </button>

        {user ? (
          <div className="text-center">
            <p className="eyebrow">Mi cuenta</p>
            <h2 className="mb-2 font-heading text-2xl font-bold text-dark">
              Hola, {user.nombre} 👋
            </h2>
            <p className="mb-6 text-sm text-neutral-600">{user.email}</p>
            <button
              type="button"
              onClick={() => {
                logoutUser();
              }}
              className="btn-outline w-full"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}</p>
            <h2 className="mb-6 font-heading text-2xl font-bold text-dark">
              {modo === 'registro' ? 'Únete a Jeya Boutique' : 'Bienvenida de nuevo'}
            </h2>

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

                <button type="submit" className="btn-primary w-full">
                  Crear cuenta
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
                {loginError && <p className="text-sm text-red-600">{loginError}</p>}
                <button type="submit" className="btn-primary w-full">
                  Entrar
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setModo(modo === 'registro' ? 'login' : 'registro');
                setErrors({});
                setLoginError('');
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
