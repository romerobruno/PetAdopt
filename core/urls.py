from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionRequestViewSet, PetViewSet

router = DefaultRouter()
router.register(r'pets', PetViewSet)
router.register(r'adoptionrequests', AdoptionRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
