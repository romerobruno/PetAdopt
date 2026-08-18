# core/views.py
from rest_framework import viewsets
from .models import Pet, AdoptionRequest
from .permissions import IsAdminOrVendedorForWrite, IsClienteAuthenticated
from .serializers import PetSerializer, AdoptionRequestSerializer


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAdminOrVendedorForWrite]


class AdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsClienteAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return AdoptionRequest.objects.none()
        return AdoptionRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
