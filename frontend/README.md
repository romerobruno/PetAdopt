# PetAdopt Frontend

Frontend en React y Bootstrap para la plataforma de adopción PetAdopt.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecución local

```bash
npm install
npm run dev
```

La aplicación define las rutas `/`, `/login` y `/register`. La Home (`/`) está protegida y redirige al Login cuando no hay una sesión activa.

## Cuenta de prueba

- Usuario: `demo`
- Contraseña: `petadopt123`

También es posible crear usuarios desde Registro. Tanto las cuentas nuevas como la sesión se almacenan solamente en memoria: se eliminan al recargar la página, ya que en este trabajo práctico no se conecta el frontend al backend.

## Verificación

```bash
npm run lint
npm run build
```
