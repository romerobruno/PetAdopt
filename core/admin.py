from django.contrib import admin

# Register your models here.

from .models import AdoptionRequest, Pet

admin.site.register(Pet)
admin.site.register(AdoptionRequest)
