# Inconsistencia de Adopter

## Problema

El proyecto tiene dos conceptos que hoy se pisan parcialmente:

- El rol de usuario `CLIENTE`, definido en `users.User`.
- El modelo `Adopter`, definido en `core.models`.

Tener ambos conceptos no es necesariamente incorrecto. El problema es que actualmente no existe una relacion real entre ellos, pero el sistema los trata como si representaran a la misma persona.

## Evidencia en el codigo

En `users/models.py`, el modelo `User` ya contiene datos de identidad y contacto:

```python
class User(AbstractUser):
    role = models.CharField(...)
    telefono = models.CharField(...)
    direccion = models.CharField(...)
    email = models.EmailField(unique=True)
```

En `core/models.py`, el modelo `Adopter` vuelve a guardar datos similares:

```python
class Adopter(models.Model):
    first_name = models.CharField(...)
    last_name = models.CharField(...)
    email = models.EmailField(unique=True)
    phone = models.CharField(...)
```

Luego `AdoptionRequest` se relaciona con `Adopter`:

```python
class AdoptionRequest(models.Model):
    pet = models.ForeignKey(Pet, ...)
    adopter = models.ForeignKey(Adopter, ...)
```

Pero en `core/views.py`, las solicitudes se filtran usando el email del usuario autenticado:

```python
return AdoptionRequest.objects.filter(adopter__email=user.email)
```

Eso significa que el sistema asume que `User.email` y `Adopter.email` identifican a la misma persona, pero esa relacion no esta expresada en la base de datos.

## Por Que Es Un Problema

`CLIENTE` es un rol de autorizacion. Sirve para responder esta pregunta:

> Que puede hacer este usuario?

`Adopter` deberia ser un concepto de dominio. Serviria para responder esta otra pregunta:

> Quien esta intentando adoptar y que informacion propia del proceso de adopcion tiene?

Hoy `Adopter` no agrega suficiente informacion de dominio como para justificar su existencia separada. En cambio, duplica datos del usuario y se conecta con el usuario de manera indirecta mediante el email.

Esto genera varios riesgos:

- Si cambia el email del usuario, sus solicitudes pueden dejar de aparecer.
- Puede existir un `User` sin `Adopter` equivalente.
- Puede existir un `Adopter` sin `User` equivalente.
- La integridad depende de una convencion, no de una relacion real de base de datos.
- El modelo queda mas dificil de explicar y mantener.

## Tambien Hay Un Riesgo De Permisos

El endpoint de adoptantes esta registrado como `ModelViewSet`:

```python
class AdopterViewSet(viewsets.ModelViewSet):
    queryset = Adopter.objects.all()
    serializer_class = AdopterSerializer
```

Si no hay permisos globales que lo bloqueen, esto puede exponer datos personales de adoptantes. Para informacion como nombre, email y telefono, eso deberia estar restringido.

## Alternativas

### Opcion Recomendada Para Este Proyecto

Eliminar `Adopter` y relacionar `AdoptionRequest` directamente con el usuario autenticado:

```python
from django.conf import settings

class AdoptionRequest(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="adoption_requests")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="adoption_requests")
    message = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

Ventajas:

- Modelo mas simple.
- No hay duplicacion de identidad.
- La solicitud pertenece directamente al usuario autenticado.
- El filtro pasa a ser robusto:

```python
return AdoptionRequest.objects.filter(user=self.request.user)
```

Esta opcion encaja mejor con el README actual, donde `CLIENTE` es el usuario autenticado que gestiona solicitudes de adopcion.

### Opcion Mas Completa De Dominio

Mantener `Adopter`, pero vincularlo explicitamente con `User`:

```python
from django.conf import settings

class Adopter(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="adopter_profile")
```

Esta opcion tiene sentido si `Adopter` va a guardar informacion especifica del proceso de adopcion, por ejemplo:

- Tipo de vivienda.
- Experiencia previa con mascotas.
- Preferencias de adopcion.
- Disponibilidad horaria.
- Motivacion para adoptar.

Si `Adopter` solo guarda nombre, apellido, email y telefono, entonces no aporta suficiente valor frente al modelo `User`.

## Recomendacion Final

Para el estado actual del proyecto, conviene simplificar:

- Mantener `CLIENTE` como rol de usuario.
- Eliminar o dejar de usar `Adopter` como identidad separada.
- Relacionar `AdoptionRequest` directamente con `User`.
- Restringir cualquier endpoint que exponga datos personales.

La regla conceptual es:

> El rol define permisos. El modelo define entidades del dominio.

Hoy `CLIENTE` y `Adopter` no estan separados con suficiente claridad. Por eso el modelo `Adopter` genera inconsistencia en vez de aportar expresividad al dominio.
