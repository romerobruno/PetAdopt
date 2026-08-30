# TP4 - Matriz de Pruebas Manuales de API

Fecha de ejecucion: 2026-06-16

## Objetivo

Validar las reglas de autenticacion, autorizacion y consistencia del dominio despues de simplificar el modelo de adopciones.

El cambio principal fue eliminar el uso de `Adopter` como identidad separada. Ahora una solicitud de adopcion (`AdoptionRequest`) pertenece directamente al usuario autenticado (`User`).

Regla conceptual aplicada:

```txt
CLIENTE = rol de permisos
User = persona autenticada
AdoptionRequest = solicitud creada por ese User
```

## Ambiente

- API base: `http://127.0.0.1:8000/api/`
- Backend: Django + Django REST Framework
- Autenticacion: JWT
- Base de datos usada por el proyecto: PostgreSQL local, `programacion1_db`

Antes de probar:

```powershell
venv\Scripts\python.exe manage.py migrate
venv\Scripts\python.exe manage.py runserver
```

## Usuarios de prueba

Para la ejecucion se pueden usar usuarios temporales con prefijo `tp4_`:

- `ADMIN`: usuario con `role = ADMIN`
- `VENDEDOR`: usuario con `role = VENDEDOR`
- `CLIENTE`: usuario con `role = CLIENTE`
- `CLIENTE secundario`: usuario con `role = CLIENTE`

## Flujo base en Postman

### 1. Registrar usuario cliente

```http
POST /api/users/register/
```

Body:

```json
{
  "username": "tp4_cliente",
  "email": "tp4_cliente@example.com",
  "password": "Password123",
  "telefono": "111111",
  "direccion": "Calle 123"
}
```

Resultado esperado:

```txt
201 Created
```

### 2. Obtener token JWT

```http
POST /api/token/
```

Body:

```json
{
  "username": "tp4_cliente",
  "password": "Password123"
}
```

Resultado esperado:

```txt
200 OK
```

Guardar el `access` token y usarlo en Postman como:

```txt
Authorization: Bearer <access>
```

### 3. Crear una mascota con usuario autorizado

Para crear mascotas se debe usar `ADMIN` o `VENDEDOR`.

```http
POST /api/pets/
```

Body:

```json
{
  "name": "Luna",
  "species": "Perro",
  "breed": "Mestiza",
  "age": 2,
  "description": "Muy tranquila"
}
```

Resultado esperado:

```txt
201 Created
```

Guardar el `id` de la mascota para crear solicitudes de adopcion.

## Matriz de pruebas

| ID | Endpoint | Rol utilizado | Accion | Datos enviados | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|---|
| TP4-001 | `GET /api/pets/` | Publico | Listar mascotas | Sin token | `200 OK` | Pendiente | Pendiente |
| TP4-002 | `POST /api/pets/` | Sin autenticar | Intentar crear mascota | Mascota valida | `401 Unauthorized` | Pendiente | Pendiente |
| TP4-003 | `POST /api/pets/` | CLIENTE | Intentar crear mascota | Mascota valida | `403 Forbidden` | Pendiente | Pendiente |
| TP4-004 | `POST /api/pets/` | ADMIN o VENDEDOR | Crear mascota | Mascota valida | `201 Created` | Pendiente | Pendiente |
| TP4-005 | `PATCH /api/pets/{id}/` | CLIENTE | Intentar editar mascota | Cambio de edad | `403 Forbidden` | Pendiente | Pendiente |
| TP4-006 | `PATCH /api/pets/{id}/` | ADMIN o VENDEDOR | Editar mascota | Cambio de edad | `200 OK` | Pendiente | Pendiente |
| TP4-007 | `DELETE /api/pets/{id}/` | CLIENTE | Intentar borrar mascota | ID existente | `403 Forbidden` | Pendiente | Pendiente |
| TP4-008 | `DELETE /api/pets/{id}/` | ADMIN o VENDEDOR | Borrar mascota | ID existente | `204 No Content` | Pendiente | Pendiente |
| TP4-009 | `POST /api/users/register/` | Publico | Registrar usuario con email repetido | Email ya existente | `400 Bad Request` | Pendiente | Pendiente |
| TP4-010 | `GET /api/adoptionrequests/` | Sin autenticar | Intentar listar solicitudes | Sin token | `401 Unauthorized` | Pendiente | Pendiente |
| TP4-011 | `GET /api/adoptionrequests/` | ADMIN | Intentar listar solicitudes | Token ADMIN | `403 Forbidden` | Pendiente | Pendiente |
| TP4-012 | `POST /api/adoptionrequests/` | ADMIN | Intentar crear solicitud | Pet valida | `403 Forbidden` | Pendiente | Pendiente |
| TP4-013 | `POST /api/adoptionrequests/` | CLIENTE | Crear solicitud propia | Pet valida + mensaje | `201 Created` | Pendiente | Pendiente |
| TP4-014 | `GET /api/adoptionrequests/` | CLIENTE | Listar solicitudes propias | Token CLIENTE | `200 OK` y solo solicitudes del usuario autenticado | Pendiente | Pendiente |
| TP4-015 | `POST /api/adoptionrequests/` | CLIENTE | Intentar crear solicitud duplicada | Misma pet que TP4-013 | `400 Bad Request` | Pendiente | Pendiente |
| TP4-016 | `POST /api/adoptionrequests/` | CLIENTE | Intentar enviar un `user` manual en el body | Pet valida + `user` de otro usuario | `201 Created`, pero asociada al usuario autenticado | Pendiente | Pendiente |
| TP4-017 | `GET /api/adopters/` | Publico | Verificar que el endpoint viejo no exista | Sin token | `404 Not Found` | Pendiente | Pendiente |
| TP4-018 | `POST /api/adopters/` | Publico | Verificar que no se puedan crear adoptantes separados | Datos de adoptante | `404 Not Found` | Pendiente | Pendiente |

## Casos clave de correccion

### Caso 1: una solicitud queda asociada al usuario autenticado

Endpoint:

```http
POST /api/adoptionrequests/
```

Rol utilizado: `CLIENTE`

Headers:

```txt
Authorization: Bearer <access_cliente>
```

Body:

```json
{
  "pet": 1,
  "message": "Me interesa adoptarla"
}
```

Resultado esperado:

```txt
201 Created
```

El response debe incluir el `user` del cliente autenticado. No se envia `adopter`.

### Caso 2: no se puede crear una solicitud para otro usuario

Endpoint:

```http
POST /api/adoptionrequests/
```

Rol utilizado: `CLIENTE`

Body:

```json
{
  "pet": 1,
  "user": 999,
  "message": "Intento forzar otro usuario"
}
```

Resultado esperado:

```txt
201 Created
```

Aclaracion: el request puede crearse porque `user` es de solo lectura en el serializer. El valor enviado en el body debe ser ignorado y la solicitud debe quedar asociada al usuario autenticado por el token.

### Caso 3: no se permiten solicitudes duplicadas

Endpoint:

```http
POST /api/adoptionrequests/
```

Rol utilizado: `CLIENTE`

Body:

```json
{
  "pet": 1,
  "message": "Solicitud repetida"
}
```

Resultado esperado si el mismo cliente ya solicito esa mascota:

```txt
400 Bad Request
```

Motivo:

```txt
Existe una restriccion unica para la combinacion pet + user.
```

### Caso 4: el endpoint de adoptantes ya no esta expuesto

Endpoints:

```http
GET /api/adopters/
POST /api/adopters/
```

Resultado esperado:

```txt
404 Not Found
```

Motivo:

```txt
Adopter fue eliminado del flujo porque duplicaba datos de User.
```

## Evidencia de ejecucion

Completar despues de probar en Postman:

```txt
TP4-001:
Captura:
Observacion:

TP4-002:
Captura:
Observacion:

TP4-003:
Captura:
Observacion:

TP4-004:
Captura:
Observacion:

TP4-005:
Captura:
Observacion:

TP4-006:
Captura:
Observacion:

TP4-007:
Captura:
Observacion:

TP4-008:
Captura:
Observacion:

TP4-009:
Captura:
Observacion:

TP4-010:
Captura:
Observacion:

TP4-011:
Captura:
Observacion:

TP4-012:
Captura:
Observacion:

TP4-013:
Captura:
Observacion:

TP4-014:
Captura:
Observacion:

TP4-015:
Captura:
Observacion:

TP4-016:
Captura:
Observacion:

TP4-017:
Captura:
Observacion:

TP4-018:
Captura:
Observacion:
```

## Verificacion automatizada complementaria

Ademas de Postman, se ejecutaron pruebas automatizadas con Django:

```powershell
venv\Scripts\python.exe manage.py test
```

Resultado:

```txt
Found 7 test(s).
System check identified no issues (0 silenced).
Ran 7 tests.
OK
```

## Conclusion

La correccion elimina la inconsistencia entre `CLIENTE` y `Adopter`.

Antes, el sistema dependia de comparar `User.email` con `Adopter.email`. Ahora `AdoptionRequest` se relaciona directamente con `User`, por lo que la integridad queda expresada en la base de datos y no en una convencion.
