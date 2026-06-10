from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Datos de identidad", {"fields": ("role", "telefono", "direccion")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Datos de identidad", {"fields": ("email", "role", "telefono", "direccion")}),
    )
    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
