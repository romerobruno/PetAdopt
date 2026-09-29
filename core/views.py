from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import AdoptionRequest, Pet
from .permissions import IsAdminOrVendedor, IsAdminOrVendedorForWrite, IsClienteAuthenticated
from .serializers import AdoptionRequestSerializer, PetSerializer


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAdminOrVendedorForWrite]

    def get_queryset(self):
        queryset = Pet.objects.all().order_by("-created_at")
        search = self.request.query_params.get("search", "").strip()
        species = self.request.query_params.get("species", "").strip()
        available = self.request.query_params.get("available")

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(species__icontains=search)
                | Q(breed__icontains=search)
            )
        if species:
            queryset = queryset.filter(species__iexact=species)
        if available is not None:
            queryset = queryset.filter(is_available=available.lower() in ("1", "true", "yes"))

        return queryset


class AdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_permissions(self):
        if self.action in ("approve", "reject"):
            permission_class = IsAdminOrVendedor
        elif self.action in ("list", "retrieve"):
            permission_class = permissions.IsAuthenticated
        else:
            permission_class = IsClienteAuthenticated
        return [permission_class()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return AdoptionRequest.objects.none()
        queryset = AdoptionRequest.objects.select_related("pet", "user").order_by("-created_at")
        if user.role not in (user.Roles.ADMIN, user.Roles.VENDEDOR):
            queryset = queryset.filter(user=user)

        request_status = self.request.query_params.get("status", "").strip().upper()
        if request_status:
            queryset = queryset.filter(status=request_status)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        with transaction.atomic():
            adoption_request = self.get_object()
            pet = Pet.objects.select_for_update().get(pk=adoption_request.pet_id)
            if not pet.is_available and adoption_request.status != AdoptionRequest.Status.APPROVED:
                return Response(
                    {"detail": "La mascota ya fue asignada a otra solicitud."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            adoption_request.status = AdoptionRequest.Status.APPROVED
            adoption_request.save(update_fields=["status", "updated_at"])
            AdoptionRequest.objects.filter(
                pet=pet,
                status=AdoptionRequest.Status.PENDING,
            ).exclude(pk=adoption_request.pk).update(
                status=AdoptionRequest.Status.REJECTED,
                updated_at=timezone.now(),
            )
            pet.is_available = False
            pet.save(update_fields=["is_available", "updated_at"])
        return Response(self.get_serializer(adoption_request).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        with transaction.atomic():
            adoption_request = self.get_object()
            was_approved = adoption_request.status == AdoptionRequest.Status.APPROVED
            adoption_request.status = AdoptionRequest.Status.REJECTED
            adoption_request.save(update_fields=["status", "updated_at"])
            if was_approved:
                pet = Pet.objects.select_for_update().get(pk=adoption_request.pet_id)
                pet.is_available = True
                pet.save(update_fields=["is_available", "updated_at"])
        return Response(self.get_serializer(adoption_request).data, status=status.HTTP_200_OK)
