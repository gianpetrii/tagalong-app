# TagAlong App

## Descripción del proyecto

Plataforma de **carpooling / viajes compartidos**: conductores y pasajeros publican u ofrecen trayectos, con reglas de negocio y despliegue sobre **Firebase** (incluye scripts npm para reglas y hosting).

## Problema que resuelve

Coordina desplazamientos compartidos sin depender solo de grupos informales de mensajería, donde no hay confianza, historial ni precios transparentes para desvíos o recogidas.

## Stack

- Next.js, React, TypeScript, Tailwind
- Firebase

## Requisitos

- Node.js LTS
- Firebase CLI para scripts `firebase:*`

## Instalación

```bash
npm install
npm run dev
```

Scripts útiles: `build`, `start`, `lint`, `dev:fast`, `export`, `firebase:deploy`, `firebase:init`, `firebase:login`, `deploy`.

## Variables de entorno

`.env.local` con `NEXT_PUBLIC_FIREBASE_*` y el resto que indique el código.
