from rest_framework import permissions


class IsAdminOrVendedorForWrite(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role in (user.Roles.ADMIN, user.Roles.VENDEDOR)
        )


class IsClienteAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == user.Roles.CLIENTE)
