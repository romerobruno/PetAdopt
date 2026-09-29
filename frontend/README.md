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

Crear `frontend/.env` con:

```env
VITE_API_URL=http://localhost:8000/api
```

La aplicación define rutas públicas para la Home, el catálogo y el detalle. El historial, perfil y panel administrativo consumen la API Django mediante JWT.

Los usuarios creados desde Registro reciben el rol `CLIENTE`. Para probar el panel, crear un superusuario en Django y asignarle rol `ADMIN` desde `http://localhost:8000/admin/`.

Consultar todas las rutas y permisos en [`../docs/tp9-rutas.md`](../docs/tp9-rutas.md).

## Verificación

```bash
npm run lint
npm run build
```
