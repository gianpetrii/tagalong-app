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


## Proximos features:
Perfecto, voy a listar todos los cambios propuestos de manera organizada y secuencial, excluyendo la optimización de rutas:

**Fase 1: Sistema de Mapas y Ubicaciones**
1. Implementar búsqueda de ubicaciones con Google Maps/Mapbox
   - Autocompletado de direcciones
   - Extracción automática de ciudad/provincia
   - Cálculo de distancias y tiempos
   - Visualización de puntos de referencia

2. Mejorar el sistema de paradas
   - Permitir direcciones completas
   - Visualización en mapa de la ruta completa
   - Cálculo automático de tiempos entre paradas
   - Tiempo máximo de espera configurable

**Fase 2: Servicio de Recogida y Entrega**
3. Implementar sistema de recogida/entrega personalizada
   - Radio máximo de desvío configurable
   - Cálculo automático de tarifas extra
   - Configuración de tarifas por km por conductor
   - Visualización clara de precios (base + extra)

**Fase 3: Sistema de Chat y Comunicación**
4. Implementar chat en tiempo real
   - Chat individual con conductor
   - Grupos automáticos para viajes confirmados
   - Compartir ubicación en tiempo real
   - Notificaciones push
   - Indicadores de estado (visto, escribiendo)
   - Compartir fotos
   - Actualizaciones grupales del conductor

**Fase 4: Sistema de Pagos**
5. Integrar sistema de pagos
   - Manejo de pagos por servicios extra
   - Sistema de pagos parciales/cuotas
   - Sistema de reembolsos
   - Historial de transacciones

**Fase 5: Sistema de Calificaciones**
6. Mejorar sistema de calificaciones
   - Calificaciones separadas para viaje y servicio extra
   - Sistema de verificación de identidad
   - Historial de calificaciones
   - Promedios y estadísticas

**Fase 6: Sistema de Notificaciones**
7. Implementar sistema de notificaciones
   - Recordatorios automáticos
   - Alertas de cambios
   - Notificaciones de nuevos pasajeros
   - Configuración de preferencias de notificación

¿Te parece bien este orden? Podemos empezar por la Fase 1 y avanzar secuencialmente, asegurándonos de que cada fase esté bien probada antes de continuar con la siguiente. ¿Por cuál te gustaría que empecemos?
