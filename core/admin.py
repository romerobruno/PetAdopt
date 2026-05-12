from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.

from .models import Pet, Adopter, AdoptionRequest, Usuario

admin.site.register(Pet)
admin.site.register(Adopter)
admin.site.register(AdoptionRequest)


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Informacion personal", {"fields": ("nombre", "first_name", "last_name", "email", "edad", "genero", "rol")}),
        ("Permisos", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Fechas importantes", {"fields": ("last_login", "date_joined", "fecha_registro")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "nombre", "edad", "genero", "rol", "password1", "password2"),
        }),
    )
