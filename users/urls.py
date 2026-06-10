from django.urls import path

from .views import LogoutView, ProfileView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
