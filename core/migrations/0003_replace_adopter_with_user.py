from django.conf import settings
import django.db.models.deletion
from django.db import migrations, models


def copy_adopter_to_user(apps, schema_editor):
    AdoptionRequest = apps.get_model("core", "AdoptionRequest")
    User = apps.get_model("users", "User")
    seen_requests = set()

    for adoption_request in AdoptionRequest.objects.select_related("adopter").order_by("id"):
        user = User.objects.filter(email=adoption_request.adopter.email).first()
        if user is None:
            adoption_request.delete()
            continue
        request_key = (adoption_request.pet_id, user.id)
        if request_key in seen_requests:
            adoption_request.delete()
            continue
        seen_requests.add(request_key)
        adoption_request.user = user
        adoption_request.save(update_fields=["user"])


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("core", "0002_remove_pet_is_available_pet_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="adoptionrequest",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="adoption_requests",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RunPython(copy_adopter_to_user, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="adoptionrequest",
            name="adopter",
        ),
        migrations.AlterField(
            model_name="adoptionrequest",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="adoption_requests",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.DeleteModel(
            name="Adopter",
        ),
        migrations.AddConstraint(
            model_name="adoptionrequest",
            constraint=models.UniqueConstraint(
                fields=("pet", "user"),
                name="unique_adoption_request_per_user_pet",
            ),
        ),
    ]
