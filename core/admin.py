from django.contrib import admin

# Register your models here.

from .models import Pet, Adopter, AdoptionRequest

admin.site.register(Pet)
admin.site.register(Adopter)
admin.site.register(AdoptionRequest)
