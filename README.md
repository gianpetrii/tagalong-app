# TagAlong App

Aplicación para compartir viajes y conectar personas que viajan en la misma dirección.

## Tecnologías

- Next.js 15
- React 18
- Firebase (Firestore, Authentication, Storage, Hosting)
- Tailwind CSS

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo `.env.local.example` a `.env.local` y actualiza las variables de entorno con tus credenciales de Firebase:
   ```bash
   cp .env.local.example .env.local
   ```

## Desarrollo

```bash
npm run dev
```

## Despliegue

Para desplegar a Firebase Hosting:

1. Inicia sesión en Firebase:
   ```bash
   npm run firebase:login
   ```

2. Inicializa Firebase (si es la primera vez):
   ```bash
   npm run firebase:init
   ```

3. Despliega la aplicación:
   ```bash
   npm run deploy
   ```

## Estructura del Proyecto

- `/app`: Páginas de la aplicación
- `/components`: Componentes reutilizables
- `/lib`: Utilidades, configuraciones y tipos
- `/public`: Archivos estáticos 