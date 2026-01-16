# Guía de Despliegue en Windows Server (Full Stack - Node.js + IIS)

Esta guía detalla los pasos para publicar la aplicación "Agenda CNDES" en un servidor Windows Server. Debido a que la aplicación ahora cuenta con un **backend en Node.js** para gestionar archivos y datos, el proceso de despliegue ha cambiado.

## Prerrequisitos

1.  **Windows Server** con rol de Web Server (IIS) instalado.
2.  **Node.js (LTS)** instalado en el servidor (ej: v18.x o superior). [Descargar Node.js](https://nodejs.org/).
3.  **IIS URL Rewrite Module** instalado en el servidor. [Descargar](https://www.iis.net/downloads/microsoft/url-rewrite).
4.  **Application Request Routing (ARR)** para IIS (para configurar el proxy reverso). [Descargar](https://www.iis.net/downloads/microsoft/application-request-routing).

## Paso 1: Generar la Versión de Producción

En su máquina de desarrollo, ejecute el siguiente comando para compilar el Frontend:

```powershell
npm run build
```

Esto actualizará la carpeta `dist/` con la última versión de la interfaz.

## Paso 2: Preparar los Archivos para el Servidor

A diferencia de un sitio estático, ahora necesitamos copiar tanto el servidor como el cliente compilado.

1.  Cree una carpeta en el servidor, por ejemplo: `C:\inetpub\wwwroot\agenda-cndes`.
2.  Copie **todo el contenido del proyecto** (excluyendo `node_modules` para ahorrar tiempo de copia) a esta carpeta.
    *   Asegúrese de copiar la carpeta `server/`.
    *   Asegúrese de copiar la carpeta `dist/` (generada en el paso 1).
    *   Copie el archivo `package.json` de la raíz (opcional, pero copie el de `server/`).

*Estructura recomendada en el servidor:*
```
C:\inetpub\wwwroot\agenda-cndes\
  ├── dist\            (Archivos del frontend compilado)
  ├── server\          (Código del servidor Node.js)
  │     ├── data\      (Aquí se guardarán los JSON de datos)
  │     ├── uploads\   (Aquí se guardarán los archivos subidos)
  │     ├── index.js
  │     └── package.json
```

## Paso 3: Instalar Dependencias en el Servidor

1.  Abra una terminal (PowerShell o CMD) en el servidor.
2.  Navegue a la carpeta del servidor:
    ```powershell
    cd C:\inetpub\wwwroot\agenda-cndes\server
    ```
3.  Instale las dependencias de producción:
    ```powershell
    npm install --omit=dev
    ```

## Paso 4: Ejecutar el Servidor Node.js

Puede ejecutar el servidor manualmente para probar, o usar un gestor de procesos como `pm2` o configurarlo como servicio de Windows.

**Opción A: Ejecución Manual (Prueba)**
```powershell
node index.js
```
El servidor debería iniciar en el puerto **3000** (por defecto) y mostrará:
`Server running on port 3000`

**Opción B: Usar PM2 (Recomendado para Producción)**
1.  Instale PM2 globalmente: `npm install -g pm2`
2.  Inicie el servidor: `pm2 start index.js --name "agenda-cndes"`
3.  Configure el inicio automático: `pm2 startup` (siga las instrucciones que aparezcan).

## Paso 5: Configurar IIS como Proxy Reverso

Para que la aplicación sea accesible por el puerto 80/443 sin exponer directamente el puerto 3000 y para integrarse con la infraestructura existente:

1.  Abra **Administrador de IIS**.
2.  Cree un nuevo sitio web o use uno existente (ej: `AgendaCNDES`) apuntando a una carpeta vacía o a la carpeta del proyecto (la ruta física no importa tanto si usamos proxy, pero puede apuntar a `C:\inetpub\wwwroot\agenda-cndes`).
3.  Haga doble clic en **URL Rewrite**.
4.  En el panel derecho, haga clic en **Add Rule(s)...** -> **Reverse Proxy**.
    *   Si le pide habilitar el proxy, acepte.
5.  En "Inbound Rules", ingrese la dirección del servidor Node.js:
    *   **Server name or IP address**: `localhost:3000`
6.  Marque "SSL Offloading" según sus necesidades.
7.  Haga clic en **OK**.

Ahora, todas las peticiones que lleguen a su sitio IIS serán redirigidas internamente a `http://localhost:3000`, donde su servidor Node.js las procesará y devolverá la aplicación React o los datos de la API.

## Paso 6: Persistencia y Permisos

1.  Asegúrese de que la carpeta `server/data` y `server/uploads` tengan permisos de **Escritura** para el usuario que ejecuta el proceso de Node.js (generalmente su usuario si lo ejecuta manual, o SYSTEM/Network Service si es un servicio).
2.  **IMPORTANTE**: No borre la carpeta `server/data` o `server/uploads` al hacer nuevos despliegues, o perderá los datos y archivos subidos.

---

## Solución de Problemas

### La API falla al subir archivos
*   Verifique que la carpeta `server/uploads` exista. El servidor intenta crearla al inicio.
*   Verifique los permisos de escritura en esa carpeta.

### Error 502 Bad Gateway
*   Significa que IIS no puede conectar con Node.js. Asegúrese de que el servidor Node.js está corriendo en el puerto 3000 (`pm2 status` o revise su consola).
