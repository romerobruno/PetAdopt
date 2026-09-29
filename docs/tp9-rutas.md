# TP9 — Rutas, API y permisos

## Rutas del frontend

| Ruta | Acceso | Función |
| --- | --- | --- |
| `/` | Público | Home con mascotas disponibles destacadas |
| `/mascotas` | Público | Catálogo con búsqueda y filtro por especie |
| `/mascotas/:id` | Público | Detalle y formulario de solicitud |
| `/login` | Público | Inicio de sesión JWT |
| `/register` | Público | Registro de clientes |
| `/perfil` | Autenticado | Consulta y edición del perfil |
| `/mis-solicitudes` | `CLIENTE` | Historial y estado de solicitudes propias |
| `/admin/mascotas` | `ADMIN`, `VENDEDOR` | Listado, edición y eliminación de mascotas |
| `/admin/mascotas/nueva` | `ADMIN`, `VENDEDOR` | Alta de mascota con imagen |
| `/admin/mascotas/:id/editar` | `ADMIN`, `VENDEDOR` | Edición de mascota |
| `/admin/solicitudes` | `ADMIN`, `VENDEDOR` | Revisión, aprobación y rechazo de solicitudes |
| `/no-autorizado` | Público | Mensaje de permisos insuficientes |

La protección del frontend evita mostrar pantallas incompatibles con el rol. La API vuelve a verificar los permisos; ocultar un enlace no reemplaza la autorización del backend.

## Endpoints utilizados

| Método y endpoint | Acceso | Función |
| --- | --- | --- |
| `GET /api/pets/` | Público | Listar mascotas |
| `GET /api/pets/{id}/` | Público | Obtener una mascota |
| `POST /api/pets/` | `ADMIN`, `VENDEDOR` | Crear mascota |
| `PATCH /api/pets/{id}/` | `ADMIN`, `VENDEDOR` | Editar mascota |
| `DELETE /api/pets/{id}/` | `ADMIN`, `VENDEDOR` | Eliminar mascota |
| `GET /api/adoptionrequests/` | Autenticado | Historial propio o listado global según rol |
| `POST /api/adoptionrequests/` | `CLIENTE` | Crear solicitud |
| `POST /api/adoptionrequests/{id}/approve/` | `ADMIN`, `VENDEDOR` | Aprobar solicitud |
| `POST /api/adoptionrequests/{id}/reject/` | `ADMIN`, `VENDEDOR` | Rechazar solicitud |
| `GET/PATCH /api/users/profile/` | Autenticado | Consultar o editar perfil |

## Filtros de la API

`GET /api/pets/` acepta:

- `search`: busca coincidencias parciales en nombre, especie o raza.
- `species`: coincidencia exacta de especie, sin distinguir mayúsculas.
- `available=true|false`: filtra por disponibilidad.

`GET /api/adoptionrequests/` acepta `status=PENDING|APPROVED|REJECTED`.

## Estados y reglas

- Una solicitud nueva comienza como `PENDING`.
- Un cliente no puede enviar dos solicitudes para la misma mascota.
- No se puede solicitar una mascota no disponible.
- Al aprobar una solicitud, la mascota queda no disponible y se rechazan las demás solicitudes pendientes asociadas.
- Al rechazar una solicitud previamente aprobada, la mascota vuelve a quedar disponible.
- Los campos de identidad, email y rol no pueden modificarse desde el perfil.
- Las solicitudes no se editan ni eliminan directamente; su estado cambia únicamente mediante las acciones administrativas de aprobación y rechazo.
