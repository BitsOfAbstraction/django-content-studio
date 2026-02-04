import datetime
import random

from django.db import models
from django.utils import timezone

from content_studio.settings import cs_settings


def generate_code():
    return "".join(str(random.randint(0, 9)) for _ in range(6))


class PasswordResetCode(models.Model):
    class Meta:
        db_table = "dcs_password_reset_code"
        verbose_name = "Password reset code"
        verbose_name_plural = "Password reset codes"

    email = models.EmailField(
        max_length=255, verbose_name="Email address", editable=False
    )

    code = models.CharField(
        max_length=6, verbose_name="Code", default=generate_code, editable=False
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")

    @property
    def expired(self):
        return (
            self.created_at
            + datetime.timedelta(minutes=cs_settings.PASSWORD_RESET_EXPIRATION_TIME)
            < timezone.now()
        )

    def __str__(self):
        return self.email
