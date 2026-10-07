'use client';

import { useAuth } from '@/lib/auth/store';

const CAMPOS: { key: 'nombre' | 'apellido' | 'email' | 'pais' | 'telefono' | 'fechaNacimiento'; label: string }[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'email', label: 'Correo' },
  { key: 'pais', label: 'País' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'fechaNacimiento', label: 'Fecha de nacimiento' },
];

export default function MiPerfilPage() {
  const { user, loading } = useAuth();

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <h1 className="mb-8 font-heading text-2xl font-semibold text-dark">Mi perfil</h1>

      {loading ? null : !user ? (
        <p className="text-sm text-neutral-500">Inicia sesión para ver tu perfil.</p>
      ) : (
        <dl className="flex flex-col gap-4">
          {CAMPOS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1 border-b border-black/10 pb-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
              <dd className="text-sm text-dark">{user[key] || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
