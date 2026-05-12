from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, AdopterViewSet, AdoptionRequestViewSet

router = DefaultRouter()
router.register(r'pets', PetViewSet)
router.register(r'adopters', AdopterViewSet)
router.register(r'adoptionrequests', AdoptionRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
