# Cargo Orders

Interfaz móvil de órdenes de carga construida con **Vite + React 19 + TypeScript** y **CSS Modules**.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + bundle de producción
npm run preview
```

La URL base de la API vive en `.env` (`VITE_API_BASE_URL`).

## Deploy en Vercel

La configuración está en [vercel.json](vercel.json). Vercel detecta Vite solo, pero se
declara explícito el `buildCommand` y el `outputDirectory`.

Lo importante es el **rewrite**: la app usa `BrowserRouter`, así que sin él una recarga o un
enlace compartido a `/orders/:id` devolvería 404 — ese archivo no existe en disco.

```json
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

No rompe los estáticos: Vercel revisa el sistema de archivos **antes** de aplicar rewrites, así
que `/assets/*` y `/icons/*` se sirven directo y solo las rutas sin archivo caen al `index.html`.

Los bundles de `/assets` llevan hash en el nombre, por eso se cachean con `immutable` a un año.
Los iconos de `/icons` **no** llevan hash: se quedan con el caché por defecto de Vercel, que
revalida en cada carga, para que sustituir un icono se refleje sin purgar nada.

`.env` está versionado y solo contiene la URL pública del mock, así que el build de Vercel la toma
sin configurar nada. Si se quiere apuntar a otro backend, basta con definir `VITE_API_BASE_URL`
en las variables de entorno del proyecto en Vercel: tiene prioridad sobre el archivo.

## Estructura

```
src/
├── components/
│   ├── ui/        primitivos reutilizables (Button, Card, Tabs, Accordion, Icon...)
│   ├── orders/    piezas de la pantalla de listado
│   └── details/   piezas de la pantalla de detalle
├── screens/       CargoOrders · CargoDetails
├── hooks/         useAsync, useOrders, useOrderDetail, useCountdown, useDisclosure
├── services/      http (cliente único) · orders.service (endpoints)
├── utils/         normalize, date, address, status, filterOrders, cx
├── types/         contratos de la API y del modelo de la UI
└── styles/        tokens.css (variables) · reset.css · global.css
```

Cada componente vive en su carpeta junto a su `.module.css`. Los colores, espaciados, radios y
tiempos de transición son variables CSS en `src/styles/tokens.css`.

## Iconos

Toda la interfaz usa un único componente `Icon` que hoy renderiza siempre el mismo SVG placeholder,
sin importar el `name` que reciba. Para colocar los iconos definitivos:

1. Crear `src/components/ui/Icon/icons.tsx` con `const ICONS: Record<IconName, ReactNode>`.
2. En `Icon.tsx`, sustituir el placeholder por `{ICONS[name] ?? <Placeholder />}`.

Ningún componente consumidor necesita cambios. Los nombres ya en uso están en el tipo `IconName`.

## Notas sobre la API

Los dos endpoints devuelven los destinos con formas distintas (`start_date` + `nickname` en el
listado, `startDate` + `contact_info` en el detalle). Esa diferencia se resuelve una sola vez en
[src/utils/normalize.ts](src/utils/normalize.ts); el resto de la app consume un único modelo.

Dos particularidades del mock de Postman:

- Los `start_date` de las órdenes ya pasaron, por lo que las cuentas regresivas aparecen vencidas y
  los botones de pickup salen habilitados. La lógica de `useCountdown` funciona igual con fechas
  futuras.
- `/orders` ignora el id y siempre responde con la misma orden (`ID7PJQBJ`, `status: 1`). Para que
  el gating de **Track Order** (`status >= 3`) sea demostrable, el listado pasa el status real de la
  orden por el `state` del router y el detalle lo usa cuando el `_id` recibido no coincide con el
  solicitado.
