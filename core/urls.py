from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionRequestViewSet, PetViewSet, health_check

router = DefaultRouter()
router.register(r'pets', PetViewSet)
router.register(r'adoptionrequests', AdoptionRequestViewSet)

urlpatterns = [
    path('health/', health_check, name='health'),
    path('', include(router.urls)),
]
