from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


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
