from rest_framework import serializers
from .models import AdoptionRequest, Pet


class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = (
            "id",
            "name",
            "species",
            "breed",
            "age",
            "description",
            "image",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class AdoptionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdoptionRequest
        fields = ("id", "pet", "user", "message", "is_approved", "created_at", "updated_at")
        read_only_fields = ("id", "user", "is_approved", "created_at", "updated_at")
        validators = []

    def validate(self, attrs):
        request = self.context["request"]
        pet = attrs.get("pet", getattr(self.instance, "pet", None))
        duplicate = AdoptionRequest.objects.filter(pet=pet, user=request.user)

        if self.instance:
            duplicate = duplicate.exclude(pk=self.instance.pk)

        if duplicate.exists():
            raise serializers.ValidationError(
                {"pet": "Ya enviaste una solicitud de adopción para esta mascota."}
            )

        return attrs
