from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationFlowTests(APITestCase):
    def test_register_login_profile_and_logout_flow(self):
        credentials = {
            "username": "adoptante",
            "email": "adoptante@example.com",
            "password": "Password123",
            "first_name": "Ana",
            "last_name": "Pérez",
        }

        register_response = self.client.post(
            "/api/users/register/",
            credentials,
            format="json",
        )

        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get(username="adoptante").role, User.Roles.CLIENTE)

        token_response = self.client.post(
            "/api/token/",
            {"username": credentials["username"], "password": credentials["password"]},
            format="json",
        )

        self.assertEqual(token_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", token_response.data)
        self.assertIn("refresh", token_response.data)

        access = token_response.data["access"]
        refresh = token_response.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        profile_response = self.client.get("/api/users/profile/")

        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["username"], credentials["username"])
        self.assertEqual(profile_response.data["first_name"], credentials["first_name"])

        logout_response = self.client.post(
            "/api/users/logout/",
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        self.client.credentials()
        refresh_response = self.client.post(
            "/api/token/refresh/",
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
