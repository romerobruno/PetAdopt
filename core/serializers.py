from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import AdoptionRequest, Pet


class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    service = serializers.CharField()


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
            "is_available",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class AdoptionRequestSerializer(serializers.ModelSerializer):
    pet_detail = PetSerializer(source="pet", read_only=True)
    user_detail = serializers.SerializerMethodField()

    class Meta:
        model = AdoptionRequest
        fields = (
            "id",
            "pet",
            "pet_detail",
            "user",
            "user_detail",
            "message",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user", "status", "created_at", "updated_at")
        validators = []

    @extend_schema_field(
        {
            "type": "object",
            "properties": {
                "id": {"type": "integer"},
                "username": {"type": "string"},
                "first_name": {"type": "string"},
                "last_name": {"type": "string"},
                "email": {"type": "string", "format": "email"},
            },
        }
    )
    def get_user_detail(self, obj):
        return {
            "id": obj.user_id,
            "username": obj.user.username,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email,
        }

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

        if pet and not pet.is_available:
            raise serializers.ValidationError(
                {"pet": "Esta mascota ya no está disponible para adopción."}
            )

        return attrs
