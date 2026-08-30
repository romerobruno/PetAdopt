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

    def test_vendedor_can_update_pet(self):
        user = User.objects.create_user(
            username="vendedor-update",
            email="vendedor-update@example.com",
            password="Password123",
            role=User.Roles.VENDEDOR,
        )
        pet = Pet.objects.create(name="Luna", species="Perro", age=2)
        self.client.force_authenticate(user=user)

        response = self.client.patch(
            f"/api/pets/{pet.pk}/",
            {"age": 3},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pet.refresh_from_db()
        self.assertEqual(pet.age, 3)

    def test_admin_can_delete_pet(self):
        user = User.objects.create_user(
            username="admin-delete",
            email="admin-delete@example.com",
            password="Password123",
            role=User.Roles.ADMIN,
        )
        pet = Pet.objects.create(name="Luna", species="Perro", age=2)
        self.client.force_authenticate(user=user)

        response = self.client.delete(f"/api/pets/{pet.pk}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Pet.objects.filter(pk=pet.pk).exists())

    def test_pet_timestamps_are_not_writable(self):
        user = User.objects.create_user(
            username="vendedor-fields",
            email="vendedor-fields@example.com",
            password="Password123",
            role=User.Roles.VENDEDOR,
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/pets/",
            {
                "name": "Luna",
                "species": "Perro",
                "age": 2,
                "created_at": "2000-01-01T00:00:00Z",
                "updated_at": "2000-01-01T00:00:00Z",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(response.data["created_at"], "2000-01-01T00:00:00Z")


class AdoptionRequestTests(APITestCase):
    def setUp(self):
        self.cliente = User.objects.create_user(
            username="cliente-adopcion",
            email="cliente-adopcion@example.com",
            password="Password123",
            role=User.Roles.CLIENTE,
        )
        self.admin = User.objects.create_user(
            username="admin-adopcion",
            email="admin-adopcion@example.com",
            password="Password123",
            role=User.Roles.ADMIN,
        )
        self.pet = Pet.objects.create(name="Milo", species="Gato", age=1)

    def test_request_is_assigned_to_authenticated_user(self):
        self.client.force_authenticate(user=self.cliente)

        response = self.client.post(
            "/api/adoptionrequests/",
            {"pet": self.pet.pk, "message": "Tengo un hogar para Milo."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        adoption_request = AdoptionRequest.objects.get()
        self.assertEqual(adoption_request.user, self.cliente)
        self.assertFalse(adoption_request.is_approved)

    def test_duplicate_request_for_same_pet_is_rejected(self):
        AdoptionRequest.objects.create(pet=self.pet, user=self.cliente)
        self.client.force_authenticate(user=self.cliente)

        response = self.client.post(
            "/api/adoptionrequests/",
            {"pet": self.pet.pk},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_can_approve_and_reject_request(self):
        adoption_request = AdoptionRequest.objects.create(pet=self.pet, user=self.cliente)
        self.client.force_authenticate(user=self.admin)

        approve_response = self.client.post(
            f"/api/adoptionrequests/{adoption_request.pk}/approve/"
        )
        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)
        adoption_request.refresh_from_db()
        self.assertTrue(adoption_request.is_approved)

        reject_response = self.client.post(
            f"/api/adoptionrequests/{adoption_request.pk}/reject/"
        )
        self.assertEqual(reject_response.status_code, status.HTTP_200_OK)
        adoption_request.refresh_from_db()
        self.assertFalse(adoption_request.is_approved)

    def test_admin_can_list_requests(self):
        AdoptionRequest.objects.create(pet=self.pet, user=self.cliente)
        self.client.force_authenticate(user=self.admin)

        response = self.client.get("/api/adoptionrequests/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_cliente_cannot_approve_request(self):
        adoption_request = AdoptionRequest.objects.create(pet=self.pet, user=self.cliente)
        self.client.force_authenticate(user=self.cliente)

        response = self.client.post(
            f"/api/adoptionrequests/{adoption_request.pk}/approve/"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
