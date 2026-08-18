from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AdoptionRequest, Pet


User = get_user_model()


class PetAccessTests(APITestCase):
    def test_pet_list_is_public(self):
        response = self.client.get("/api/pets/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_pet_create_without_token_returns_401(self):
        response = self.client.post(
            "/api/pets/",
            {"name": "Luna", "species": "Perro", "age": 2},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cliente_cannot_create_pet(self):
        user = User.objects.create_user(
            username="cliente",
            email="cliente@example.com",
            password="Password123",
            role=User.Roles.CLIENTE,
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/pets/",
            {"name": "Luna", "species": "Perro", "age": 2},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_vendedor_can_create_pet(self):
        user = User.objects.create_user(
            username="vendedor",
            email="vendedor@example.com",
            password="Password123",
            role=User.Roles.VENDEDOR,
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/pets/",
            {"name": "Luna", "species": "Perro", "age": 2},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# Create your tests here.


class AdoptionRequestAccessTests(APITestCase):
    def setUp(self):
        self.pet = Pet.objects.create(name="Luna", species="Perro", age=2)
        self.user = User.objects.create_user(
            username="cliente",
            email="cliente@example.com",
            password="Password123",
            role=User.Roles.CLIENTE,
        )

    def test_cliente_creates_adoption_request_for_authenticated_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            "/api/adoptionrequests/",
            {"pet": self.pet.id, "message": "Quiero adoptarla"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        adoption_request = AdoptionRequest.objects.get()
        self.assertEqual(adoption_request.user, self.user)

    def test_cliente_only_lists_own_adoption_requests(self):
        other_user = User.objects.create_user(
            username="otrocliente",
            email="otrocliente@example.com",
            password="Password123",
            role=User.Roles.CLIENTE,
        )
        other_pet = Pet.objects.create(name="Milo", species="Gato", age=1)
        AdoptionRequest.objects.create(pet=self.pet, user=self.user)
        AdoptionRequest.objects.create(pet=other_pet, user=other_user)
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/adoptionrequests/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["user"], self.user.id)

    def test_adopters_endpoint_is_not_registered(self):
        response = self.client.get("/api/adopters/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
