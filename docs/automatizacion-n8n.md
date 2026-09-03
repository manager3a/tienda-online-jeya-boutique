# Automatización de catálogo — Google Sheets → n8n → Jeya Boutique

Este documento es para el equipo de Cognit (no para el cliente). Explica
cómo conectar el Google Sheet donde se administra el catálogo de Jeya
Boutique con el sitio en producción, sin que el sitio dependa de saber
de dónde vienen los datos.

## 1. Estructura del Google Sheet

Crear una hoja llamada `catalogo` con estas columnas (una fila por
variante de producto, igual que en `lib/data-source/types.ts`):

| Columna | Tipo | Ejemplo |
|---|---|---|
| `id` | texto | `p001` |
| `slug` | texto | `blusa-aurora-manga-larga` |
| `nombre` | texto | `Blusa Aurora manga larga` |
| `categoria` | texto | `blusas` / `chaquetas` / `zapatos` / `faldas` / `bolsos` |
| `precio` | número | `149000` |
| `precioOriginal` | número (opcional) | `179000` |
| `descripcion` | texto | — |
| `imagen` | URL | portada de la grilla |
| `imagenes` | URLs separadas por `;` | galería del detalle |
| `talla` | texto | `S`, `M`, `36`, `Único`… |
| `color` | texto | `Negro` |
| `colorHex` | código hex | `#151716` |
| `stock` | número | `5` |
| `badge` | texto (opcional) | `Nuevo` / `Exclusiva` / `Últimas unidades` |

Filas con el mismo `id`/`slug` pero distinta combinación talla+color se
agrupan como variantes de un mismo producto.

## 2. Fotos de producto

Las fotos se suben a una carpeta de Google Drive compartida con el
equipo de Cognit; el link público (o vía la Drive API) se pega en las
columnas `imagen`/`imagenes` del Sheet. No es necesario tocar el
repositorio del sitio para actualizar fotos.

## 3. Workflow de n8n

1. **Trigger:** nodo *Google Sheets Trigger* (o *Schedule Trigger* cada
   15-30 min si el Trigger nativo no está disponible en el plan de n8n)
   apuntando a la hoja `catalogo`.
2. **Transformación:** nodo *Function*/*Code* que agrupa las filas por
   `id`, arma el arreglo `variantes[]` y produce un JSON con la misma
   forma que `Producto[]` (`lib/data-source/types.ts`).
3. **Validación mínima:** nodo *IF* que descarta filas sin `id`,
   `nombre` o `precio` numérico, y notifica a Cognit por email/Slack si
   encuentra filas inválidas.
4. **Escritura del catálogo:** nodo *HTTP Request* que hace `PUT`/`POST`
   del JSON resultante a un endpoint propio (por ejemplo, una función de
   Vercel o un pequeño servicio que sirva `products.json`) — **no** se
   escribe directo en el repositorio de GitHub para evitar comits
   automáticos ruidosos.
5. **Redeploy:** nodo *HTTP Request* final que llama al **Vercel Deploy
   Hook** del proyecto para regenerar las páginas estáticas (ISR/SSG)
   con el catálogo actualizado.

## 4. Variables de entorno del workflow (nunca en el frontend)

Configurar como credenciales/variables dentro de n8n, nunca en el
repositorio del sitio:

- `GOOGLE_SHEETS_CREDENTIALS` — credenciales OAuth de la cuenta de
  servicio de Google usada por n8n.
- `VERCEL_DEPLOY_HOOK_URL` — URL del Deploy Hook del proyecto en
  Vercel (Project Settings → Git → Deploy Hooks).
- `N8N_WEBHOOK_SECRET` — secreto compartido si se expone un webhook
  entrante para forzar una sincronización manual desde el Sheet.

## 5. Frecuencia y alcance (tier profesional)

Jeya Boutique corresponde al tier **profesional** (~30-150 productos,
actualizaciones semanales). Un trigger cada 15-30 minutos o un webhook
manual (botón "Sincronizar ahora" en un Apps Script del propio Sheet)
es suficiente — no se requiere sincronización en tiempo real como en el
tier avanzado.

## 6. Quién actualiza el catálogo

Según el brief del cliente, **Cognit administra el catálogo**, no Jeya
directamente. El Sheet puede compartirse igualmente con el equipo de
Jeya en modo lectura para que puedan revisar precios/stock sin poder
romper el formato que espera n8n.
