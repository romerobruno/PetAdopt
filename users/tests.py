from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken


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

    def test_register_with_duplicate_email_returns_400(self):
        User.objects.create_user(
            username="existente",
            email="duplicado@example.com",
            password="Password123",
        )

        response = self.client.post(
            "/api/users/register/",
            {
                "username": "nuevo",
                "email": "duplicado@example.com",
                "password": "Password123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_authenticated_user_can_update_profile(self):
        user = User.objects.create_user(
            username="perfil",
            email="perfil@example.com",
            password="Password123",
            first_name="Nombre anterior",
        )
        self.client.force_authenticate(user=user)

        response = self.client.patch(
            "/api/users/profile/",
            {
                "first_name": "Ana",
                "last_name": "Pérez",
                "telefono": "1122334455",
                "direccion": "Calle 123",
                "role": User.Roles.ADMIN,
                "email": "otro@example.com",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "Ana")
        self.assertEqual(user.last_name, "Pérez")
        self.assertEqual(user.telefono, "1122334455")
        self.assertEqual(user.direccion, "Calle 123")
        self.assertEqual(user.role, User.Roles.CLIENTE)
        self.assertEqual(user.email, "perfil@example.com")

    def test_logout_with_invalid_or_reused_token_returns_400(self):
        user = User.objects.create_user(
            username="logout",
            email="logout@example.com",
            password="Password123",
        )
        self.client.force_authenticate(user=user)

        invalid_response = self.client.post(
            "/api/users/logout/",
            {"refresh": "token-invalido"},
            format="json",
        )
        self.assertEqual(invalid_response.status_code, status.HTTP_400_BAD_REQUEST)

        refresh = str(RefreshToken.for_user(user))
        first_response = self.client.post(
            "/api/users/logout/",
            {"refresh": refresh},
            format="json",
        )
        second_response = self.client.post(
            "/api/users/logout/",
            {"refresh": refresh},
            format="json",
        )

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
