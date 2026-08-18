from django.conf import settings
from django.db import models

class Pet(models.Model):
    """Representa una mascota disponible para adopción."""
    name = models.CharField(max_length=50)
    species = models.CharField(max_length=30)
    breed = models.CharField(max_length=50, blank=True, null=True)
    age = models.PositiveIntegerField("Age (years)")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="pets/", blank=True, null=True, help_text="Foto de la mascota (opcional)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.species})"

class AdoptionRequest(models.Model):
    """Solicitud de adopción de un usuario para una mascota."""
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="adoption_requests")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="adoption_requests")
    message = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["pet", "user"], name="unique_adoption_request_per_user_pet")
        ]

    def __str__(self):
        return f"{self.user} -> {self.pet}"
