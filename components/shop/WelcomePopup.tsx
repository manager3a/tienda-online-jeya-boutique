'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/store';
import { PAISES } from '@/lib/countries';

const DISMISSED_KEY = 'jeya-welcome-dismissed';
const LEADS_KEY = 'jeya-leads-v1';

interface LeadForm {
  email: string;
  pais: string;
  telefono: string;
  dia: string;
  mes: string;
  anio: string;
}

const initialForm: LeadForm = {
  email: '',
  pais: PAISES[0].code,
  telefono: '',
  dia: '',
  mes: '',
  anio: '',
};

export default function WelcomePopup() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (user) return;
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [user]);

  function close() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // localStorage no disponible: el popup podría reaparecer, sin romper nada.
    }
  }

  function handleChange(field: keyof LeadForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof LeadForm, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Email inválido.';
    if (!/^[0-9]{7,12}$/.test(form.telefono)) nextErrors.telefono = 'Celular inválido.';
    if (!form.dia || !form.mes || !form.anio) nextErrors.anio = 'Completa tu fecha de nacimiento.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const raw = window.localStorage.getItem(LEADS_KEY);
      const leads = raw ? JSON.parse(raw) : [];
      leads.push({ ...form, fecha: new Date().toISOString() });
      window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch {
      // Si localStorage falla, igual mostramos la confirmación visual.
    }

    setEnviado(true);
    setTimeout(close, 1800);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/60" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Oferta de bienvenida"
        className="relative z-10 grid w-full max-w-lg grid-cols-1 overflow-hidden rounded-md bg-surface shadow-card sm:max-w-2xl sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl text-dark"
        >
          &times;
        </button>

        <div className="relative hidden h-full min-h-[320px] sm:block">
          <Image
            src="/images/popup-chaqueta.jpg"
            alt="Nueva colección Jeya Boutique"
            fill
            sizes="(min-width: 640px) 40vw, 0vw"
            className="object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          {enviado ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-3 text-3xl">🎉</span>
              <h2 className="mb-2 font-heading text-xl font-bold text-dark">
                ¡Listo! Ya eres parte de Jeya
              </h2>
              <p className="text-sm text-neutral-600">
                Revisa tu correo: tu cupón de bienvenida está en camino.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-2 text-2xl">🎁</p>
              <h2 className="mb-2 font-heading text-xl font-bold leading-tight text-dark">
                Llévate un 10% en tu primera compra
              </h2>
              <p className="mb-5 text-sm text-neutral-600">
                Déjanos tus datos y te enviamos un cupón exclusivo para estrenar tu próxima
                pieza Jeya hoy mismo.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    autoComplete="email"
                  />
                  {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <select
                    className="input-field"
                    value={form.pais}
                    onChange={(e) => handleChange('pais', e.target.value)}
                    aria-label="País"
                  >
                    {PAISES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.flag} {p.dial}
                      </option>
                    ))}
                  </select>
                  <div>
                    <input
                      type="tel"
                      placeholder="Celular"
                      className="input-field"
                      value={form.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      autoComplete="tel-national"
                    />
                    {errors.telefono && (
                      <span className="mt-1 block text-xs text-red-600">{errors.telefono}</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="mb-1 block text-xs font-medium text-neutral-500">
                    Fecha de nacimiento
                  </span>
                  <div className="grid grid-cols-3 gap-2">
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

                <button type="submit" className="btn-primary w-full bg-accent text-dark hover:bg-accent-dark hover:text-white">
                  Quiero mi cupón
                </button>

                <p className="text-center text-[0.7rem] leading-relaxed text-neutral-400">
                  Al registrarte aceptas recibir correos y mensajes de Jeya Boutique. Consulta
                  nuestra{' '}
                  <a href="/legal/privacidad" className="underline">
                    Política de privacidad
                  </a>{' '}
                  y{' '}
                  <a href="/legal/terminos" className="underline">
                    Términos del servicio
                  </a>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
