import django.db.models.deletion
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations, models
from django.db.models import Count


def move_adopters_to_users(apps, schema_editor):
    Adopter = apps.get_model("core", "Adopter")
    AdoptionRequest = apps.get_model("core", "AdoptionRequest")
    User = apps.get_model("users", "User")

    for adopter in Adopter.objects.all():
        user = User.objects.filter(email__iexact=adopter.email).first()

        if user is None:
            base_username = (adopter.email.split("@", 1)[0] or f"adoptante-{adopter.pk}")[:140]
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                suffix += 1
                username = f"{base_username}-{suffix}"

            user = User.objects.create(
                username=username,
                email=adopter.email,
                first_name=adopter.first_name,
                last_name=adopter.last_name,
                telefono=adopter.phone,
                role="CLIENTE",
                password=make_password(None),
            )
        else:
            changed_fields = []
            for field, value in (
                ("first_name", adopter.first_name),
                ("last_name", adopter.last_name),
                ("telefono", adopter.phone),
            ):
                if not getattr(user, field) and value:
                    setattr(user, field, value)
                    changed_fields.append(field)
            if changed_fields:
                user.save(update_fields=changed_fields)

        AdoptionRequest.objects.filter(adopter=adopter).update(user=user)

    duplicates = (
        AdoptionRequest.objects.values("pet_id", "user_id")
        .annotate(total=Count("id"))
        .filter(total__gt=1)
    )
    for duplicate in duplicates:
        requests = list(
            AdoptionRequest.objects.filter(
                pet_id=duplicate["pet_id"],
                user_id=duplicate["user_id"],
            ).order_by("created_at", "pk")
        )
        request_to_keep = requests[0]
        messages = [item.message for item in requests if item.message]
        request_to_keep.message = "\n\n".join(dict.fromkeys(messages))
        request_to_keep.is_approved = any(item.is_approved for item in requests)
        request_to_keep.save(update_fields=["message", "is_approved"])
        AdoptionRequest.objects.filter(pk__in=[item.pk for item in requests[1:]]).delete()


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
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="adoption_requests",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RunPython(move_adopters_to_users, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="adoptionrequest",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="adoption_requests",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddConstraint(
            model_name="adoptionrequest",
            constraint=models.UniqueConstraint(
                fields=("pet", "user"),
                name="unique_adoption_request_per_pet_user",
            ),
        ),
        migrations.RemoveField(
            model_name="adoptionrequest",
            name="adopter",
        ),
        migrations.DeleteModel(name="Adopter"),
    ]
