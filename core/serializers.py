from rest_framework import serializers
from .models import Pet, AdoptionRequest


class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'


class AdoptionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdoptionRequest
        fields = '__all__'
        read_only_fields = ('user',)
