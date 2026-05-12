# PetAdopt - Bruno Romero (UM) - Programacion 1

## Descripcion
Backend desarrollado con Django y Django REST Framework para gestionar el flujo base de adopciones.

Incluye:
- Panel de administracion de Django
- API REST para mascotas, adoptantes y solicitudes de adopcion
- Documentacion interactiva con Swagger
- Modelo de usuario personalizado basado en `AbstractUser`

## Tecnologias utilizadas
- Python 3
- Django
- Django REST Framework
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

6. Configurar base de datos PostgreSQL en `config/settings.py` (nombre, usuario, password, host y puerto).

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

## URLs utiles
- App base: `http://127.0.0.1:8000/`
- Admin Django: `http://127.0.0.1:8000/admin/`
- Swagger UI: `http://127.0.0.1:8000/api/docs/`
- OpenAPI schema: `http://127.0.0.1:8000/api/schema/`

## Modelo de usuario
El proyecto usa un usuario custom:
```python
AUTH_USER_MODEL = "core.Usuario"
```

Campos extra en `Usuario`:
- `nombre`
- `edad`
- `genero`
- `rol` (`usuario` o `creador`)
- `fecha_registro`

## Estructura del proyecto
- `config/`: configuracion principal
- `core/`: aplicacion base (models, views, serializers, urls)
- `templates/`: templates de interfaz
- `manage.py`: comandos de Django

