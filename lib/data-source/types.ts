export type Categoria = 'blusas' | 'chaquetas' | 'zapatos' | 'faldas' | 'bolsos';

export interface Variante {
  talla: string;
  color: string;
  colorHex: string;
  stock: number;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  precioOriginal?: number;
  descripcion: string;
  imagen: string;
  imagenes: string[];
  variantes: Variante[];
  badge?: 'Nuevo' | 'Exclusiva' | 'Últimas unidades';
}

export interface ItemCarrito {
  productId: string;
  talla: string;
  color: string;
  cantidad: number;
}

export type MetodoEnvio = 'nacional' | 'recogida';

export interface Pedido {
  orderId: string;
  fecha: string;
  items: ItemCarrito[];
  subtotal: number;
  costoEnvio: number;
  total: number;
  metodoEnvio: MetodoEnvio;
  estado: 'confirmado' | 'preparando' | 'enviado' | 'entregado';
  comprador: {
    nombre: string;
    email: string;
    telefono: string;
    direccion?: string;
    ciudad?: string;
    codigoPostal?: string;
  };
}
