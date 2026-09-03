import type { MetodoEnvio } from '../data-source/types';

export interface OpcionEnvio {
  id: MetodoEnvio;
  nombre: string;
  descripcion: string;
  tiempoEstimado: string;
  costo: number;
}

/**
 * Tarifas de envío. Igual que el catálogo, en producción estas reglas
 * deberían salir de fuente_datos_cliente si el cliente las cambia con
 * frecuencia; por ahora viven aquí porque son fijas y poco cambiantes.
 */
export const OPCIONES_ENVIO: OpcionEnvio[] = [
  {
    id: 'nacional',
    nombre: 'Envío nacional',
    descripcion: 'A través de transportadora a toda Colombia',
    tiempoEstimado: '3 a 6 días hábiles',
    costo: 15000,
  },
  {
    id: 'recogida',
    nombre: 'Recogida en tienda',
    descripcion: 'Carrera 8H #164C-13, Bogotá',
    tiempoEstimado: 'Disponible en 24 horas',
    costo: 0,
  },
];

/**
 * Costo de envío recalculado SIEMPRE desde esta tabla — nunca desde un
 * valor que el navegador pudiera haber guardado.
 */
export function calculateShippingCost(metodoEnvio: MetodoEnvio): number {
  const opcion = OPCIONES_ENVIO.find((o) => o.id === metodoEnvio);
  return opcion?.costo ?? OPCIONES_ENVIO[0].costo;
}

export function getShippingOption(metodoEnvio: MetodoEnvio): OpcionEnvio {
  return OPCIONES_ENVIO.find((o) => o.id === metodoEnvio) ?? OPCIONES_ENVIO[0];
}
