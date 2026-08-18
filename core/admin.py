from django.contrib import admin

# Register your models here.

from .models import Pet, AdoptionRequest

admin.site.register(Pet)
admin.site.register(AdoptionRequest)
