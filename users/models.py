from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        CLIENTE = "CLIENTE", "Cliente"
        VENDEDOR = "VENDEDOR", "Vendedor"

    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.CLIENTE)
    telefono = models.CharField(max_length=20, blank=True, default="")
    direccion = models.CharField(max_length=255, blank=True, default="")
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
