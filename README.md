# Backend - PetAdopt - Bruno Romero (UM) - Programacion 1

## Descripcion
Backend desarrollado con Django y Django REST Framework para gestionar el flujo base de adopciones.

Incluye:
- Panel de administracion de Django
- API REST para mascotas y solicitudes de adopcion vinculadas al usuario autenticado
- Documentacion interactiva con Swagger
- Modelo de usuario personalizado basado en `AbstractUser`
- Autenticacion JWT y autorizacion por roles

## Tecnologias utilizadas
- Python 3
- Django
- Django REST Framework
- djangorestframework-simplejwt
- drf-spectacular (OpenAPI/Swagger)
- PostgreSQL

## Instalacion
1. Clonar el repositorio:
```bash
git clone https://github.com/romerobruno/PetAdopt.git
```

2. Entrar al proyecto:
```bash
cd PetAdopt
```

3. Crear entorno virtual:
```bash
py -m venv venv
```

4. Activar entorno (PowerShell):
```bash
venv\Scripts\Activate.ps1
```

5. Instalar dependencias:
```bash
py -m pip install -r requirements.txt
```

6. Copiar `.env.example` como `.env` y completar los valores locales. Por defecto se usa SQLite en `local.sqlite3`; para PostgreSQL hay que habilitar y completar las variables `DB_*` del ejemplo.

La aplicacion genera una clave efimera si falta `SECRET_KEY` durante el desarrollo. Con `DEBUG=False`, `SECRET_KEY` es obligatoria y el proceso no inicia si no fue configurada.

7. Aplicar migraciones:
```bash
py manage.py migrate
```

8. Crear superusuario:
```bash
py manage.py createsuperuser
```

## Ejecucion
Levantar el servidor:
```bash
py manage.py runserver
```

### Frontend (TP8)

1. Copiar `frontend/.env.example` como `frontend/.env` y confirmar la URL de la API:

```env
VITE_API_URL=http://localhost:8000/api
```

2. Instalar las dependencias y levantar Vite:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:3000`. El flujo conectado incluye registro, login JWT, restauracion de sesion, perfil autenticado, listado real de mascotas y logout con invalidacion del refresh token.

## URLs utiles
- API base: `http://127.0.0.1:8000/api/`
- Admin Django: `http://127.0.0.1:8000/admin/`
- Registro: `POST http://127.0.0.1:8000/api/users/register/`
- Login JWT: `POST http://127.0.0.1:8000/api/token/`
- Refresh JWT: `POST http://127.0.0.1:8000/api/token/refresh/`
- Perfil: `GET/PATCH http://127.0.0.1:8000/api/users/profile/`
- Logout: `POST http://127.0.0.1:8000/api/users/logout/`
- Solicitudes: `GET/POST http://127.0.0.1:8000/api/adoptionrequests/`
- Aprobar solicitud: `POST http://127.0.0.1:8000/api/adoptionrequests/{id}/approve/`
- Rechazar solicitud: `POST http://127.0.0.1:8000/api/adoptionrequests/{id}/reject/`
- Swagger UI: `http://127.0.0.1:8000/api/docs/`
- OpenAPI schema: `http://127.0.0.1:8000/api/schema/`

## Trabajo Practico Nro. 3: Identidad, roles y JWT
El proyecto usa un usuario custom en la app `users`:
```python
AUTH_USER_MODEL = "users.User"
```

Campos extra:
- `role`: `ADMIN`, `CLIENTE` o `VENDEDOR`
- `telefono`
- `direccion`

Reglas de acceso implementadas:
- Lectura de mascotas: publica.
- Creacion, edicion y borrado de mascotas: solo `ADMIN` o `VENDEDOR` con JWT.
- Creacion y edicion de solicitudes de adopcion: solo `CLIENTE` autenticado. Cada solicitud se vincula directamente al usuario y el listado del cliente se limita a sus propias solicitudes.
- Consulta global y aprobacion/rechazo de solicitudes: `ADMIN` o `VENDEDOR` autenticado.
- Registro: crea usuarios como `CLIENTE` por defecto.
- Perfil: permite consultar y actualizar nombre, apellido, telefono y direccion sin permitir cambios de identidad o rol.

### Adaptacion al dominio del proyecto
El enunciado menciona productos y carrito como ejemplo de RBAC. En PetAdopt se adapto esa logica al dominio de adopciones:
- `Pet` representa el recurso equivalente a producto. Por eso su lectura es publica y su creacion, edicion o borrado queda limitada a `ADMIN` o `VENDEDOR`.
- `AdoptionRequest` pertenece directamente al usuario autenticado. La restriccion unica sobre mascota y usuario impide enviar dos solicitudes para la misma mascota. Los roles `ADMIN` y `VENDEDOR` pueden revisar y resolver las solicitudes.

JWT se eligio sobre sesiones tradicionales porque el cliente puede enviar el token en cada request con `Authorization: Bearer <access>`, y el servidor solo valida la firma y expiracion. Esto evita guardar estado de sesion en el servidor y facilita escalar la API. Para logout se usa blacklist de refresh tokens: el access token expira rapido, y el refresh token enviado a `/api/users/logout/` queda invalidado para no poder renovar credenciales.

### Pruebas de acceso para capturas en Postman
Tambien se incluye una coleccion lista para importar en Postman:
`docs/petadopt-tp3-postman-collection.json`.

1. Acceso exitoso con JWT:
   - `POST /api/users/register/` crea un usuario cliente.
   - `POST /api/token/` devuelve `access` y `refresh`.
   - `GET /api/users/profile/` con header `Authorization: Bearer <access>` devuelve `200 OK` y los datos del usuario.

2. Error 401 Unauthorized:
   - Ejecutar `POST /api/pets/` sin header `Authorization`.
   - Resultado esperado: `401 Unauthorized`.

3. Error 403 Forbidden:
   - Iniciar sesion como usuario `CLIENTE`.
   - Ejecutar `POST /api/pets/` con header `Authorization: Bearer <access>`.
   - Resultado esperado: `403 Forbidden`, porque `CLIENTE` esta autenticado pero no tiene permiso para crear mascotas.

## Estructura del proyecto
- `config/`: configuracion principal
- `core/`: aplicacion base (models, views, serializers, urls)
- `templates/`: templates de interfaz
- `manage.py`: comandos de Django

