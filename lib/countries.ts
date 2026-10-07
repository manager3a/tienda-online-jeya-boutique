export interface Pais {
  code: string;
  nombre: string;
  dial: string;
  flag: string;
}

export const PAISES: Pais[] = [
  { code: 'CO', nombre: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'MX', nombre: 'México', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', nombre: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CL', nombre: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'PE', nombre: 'Perú', dial: '+51', flag: '🇵🇪' },
  { code: 'EC', nombre: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { code: 'PA', nombre: 'Panamá', dial: '+507', flag: '🇵🇦' },
  { code: 'US', nombre: 'Estados Unidos', dial: '+1', flag: '🇺🇸' },
  { code: 'ES', nombre: 'España', dial: '+34', flag: '🇪🇸' },
];
