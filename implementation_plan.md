# Plan de Preparación para Producción - CNDES Calendar

Este documento detalla los pasos necesarios para preparar la aplicación para un entorno de producción, asegurando seguridad, rendimiento y limpieza del código.

## 1. Auditoría del Código (Frontend y Backend)

### Backend (`server/index.js`)
- **Estado Actual**: Funcional básico. Sirve archivos estáticos y API.
- **Mejoras Necesarias**:
    - [ ] **Seguridad**: Implementar `helmet` para cabeceras de seguridad HTTP.
    - [ ] **Rendimiento**: Implementar `compression` para comprimir respuestas (Gzip).
    - [ ] **Logging**: (Opcional) Implementar `morgan` para logs de peticiones HTTP.

### Frontend (`src/`)
- **Integración API**: Validado. `CalendarContext` usa rutas relativas `/api`, lo cual es correcto cuando el frontend y backend se sirven desde el mismo origen.
- **Limpieza**:
    - [ ] Eliminar `console.log` residuales utilizados para depuración.
- **Build**:
    - [ ] Verificar que `npm run build` genera correctamente la carpeta `dist`.

## 2. Pasos de Implementación

### Paso 1: Mejoras en el Servidor
1.  Instalar dependencias de producción en `server/`:
    ```bash
    npm install helmet compression
    ```
2.  Actualizar `server/index.js`:
    -   Importar y usar `helmet` (configurado para permitir imágenes/scripts necesarios).
    -   Importar y usar `compression`.

### Paso 2: Limpieza del Frontend
1.  Buscar y eliminar/comentar `console.log` en archivos clave (`CalendarContext`, componentes).

### Paso 3: Verificación de Build y Despliegue
1.  Ejecutar build del frontend: `npm run build`.
2.  Iniciar servidor de producción localmente: `node server/index.js`.
3.  Verificar acceso a la aplicación y funcionalidad completa (carga de datos, navegación).

## 3. Comandos para Producción
Para iniciar la aplicación en el servidor final:
1.  `npm install` (en raíz y en `/server`)
2.  `npm run build` (en raíz)
3.  `cd server && node index.js`
