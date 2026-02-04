from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PasswordResetCode
from .serializers import (
    PasswordResetRequestSerializer,
    CodeValidationSerializer,
    PasswordResetSubmissionSerializer,
)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        user_model = get_user_model()

        try:
            user_model.objects.get(email=email)
        except user_model.DoesNotExist:
            return Response(status=status.HTTP_202_ACCEPTED)

        # Delete any existing codes for this email.
        PasswordResetCode.objects.filter(email=email).delete()

        reset = PasswordResetCode.objects.create(email=email)

        try:
            self.send_email(reset)
        except Exception as e:
            reset.delete()
            print(e)

        return Response(status=status.HTTP_202_ACCEPTED)

    def send_email(self, reset: PasswordResetCode):
        send_mail(
            from_email=None,
            subject=_("Your password reset code"),
            message=_("Your password reset code is: ") + reset.code,
            recipient_list=[reset.email],
        )


class CodeValidationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CodeValidationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data["code"]

        existing = PasswordResetCode.objects.filter(code=code).first()

        if not existing:
            raise ValidationError("Invalid code.")

        if existing.expired:
            existing.delete()
            raise ValidationError("Expired code.")

        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetSubmissionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSubmissionSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data["code"]
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        existing = PasswordResetCode.objects.filter(code=code, email=email).first()

        if not existing:
            raise ValidationError("Invalid code.")

        if existing.expired:
            existing.delete()
            raise ValidationError("Expired code.")

        user_model = get_user_model()
        user = user_model.objects.filter(email=email).first()

        if not user:
            raise ValidationError("Invalid email.")

        user.set_password(password)

        existing.delete()

        try:
            self.send_email(email)
        except Exception as e:
            print(e)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def send_email(self, email):
        send_mail(
            from_email=None,
            subject=_("Your password has been reset"),
            message=_(
                "Your password has been reset. If you did not do this, please contact your administrator."
            ),
            recipient_list=[email],
        )
