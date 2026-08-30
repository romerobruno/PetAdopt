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


class AdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer

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
        if user.role in (user.Roles.ADMIN, user.Roles.VENDEDOR):
            return AdoptionRequest.objects.all()
        return AdoptionRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        adoption_request = self.get_object()
        adoption_request.is_approved = True
        adoption_request.save(update_fields=["is_approved", "updated_at"])
        return Response(self.get_serializer(adoption_request).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        adoption_request = self.get_object()
        adoption_request.is_approved = False
        adoption_request.save(update_fields=["is_approved", "updated_at"])
        return Response(self.get_serializer(adoption_request).data, status=status.HTTP_200_OK)
