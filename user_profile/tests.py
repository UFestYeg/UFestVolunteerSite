from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.urls import reverse

from allauth.account.models import EmailAddress
from rest_framework.test import APITestCase, APIClient
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework import status

from .models import UserProfile
from .serializers import UserSerializer
from .adapter import MyAccountAdapter

User = get_user_model()


def make_user(username="user", email=None, password="testpass123", **extra):
    if email is None:
        email = f"{username}@example.com"
    return User.objects.create_user(
        username=username, email=email, password=password, **extra
    )


# ---------------------------------------------------------------------------
# Model tests
# ---------------------------------------------------------------------------
class UserProfileModelTests(TestCase):
    def test_profile_created_automatically_for_new_user(self):
        user = make_user("alice")
        # The post_save signal should create a related profile.
        self.assertTrue(UserProfile.profiles.filter(user=user).exists())
        self.assertIsInstance(user.userprofile, UserProfile)

    def test_default_field_values(self):
        user = make_user("bob")
        profile = user.userprofile
        self.assertFalse(profile.over_eighteen)
        self.assertIsNone(profile.age)
        self.assertFalse(profile.previous_volunteer)
        self.assertFalse(profile.student_volunteer_hours)
        self.assertEqual(profile.t_shirt_size, UserProfile.M)
        # TextFields default to empty strings.
        self.assertEqual(profile.dietary_restrictions, "")
        self.assertEqual(profile.medical_restrictions, "")
        self.assertEqual(profile.special_interests, "")
        self.assertEqual(profile.emergency_contact, "")
        self.assertEqual(profile.comments, "")

    def test_str_uses_first_and_last_name(self):
        user = make_user("carol", first_name="Carol", last_name="Smith")
        self.assertEqual(str(user.userprofile), "Carol Smith")

    def test_str_with_blank_names(self):
        user = make_user("dave")
        # No first/last name set -> a single space between the empty values.
        self.assertEqual(str(user.userprofile), " ")

    def test_one_to_one_relationship(self):
        user = make_user("erin")
        profile = user.userprofile
        self.assertEqual(profile.user, user)
        self.assertEqual(profile.user_id, user.id)

    def test_profile_deleted_with_user(self):
        user = make_user("frank")
        profile_pk = user.userprofile.pk
        user.delete()
        self.assertFalse(UserProfile.profiles.filter(pk=profile_pk).exists())

    def test_t_shirt_size_choices(self):
        user = make_user("grace")
        profile = user.userprofile
        profile.t_shirt_size = UserProfile.XL
        profile.save()
        profile.refresh_from_db()
        self.assertEqual(profile.t_shirt_size, "XL")

    def test_superuser_gets_verified_email_address(self):
        admin = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="adminpass123"
        )
        email = EmailAddress.objects.filter(user=admin, email="admin@example.com")
        self.assertTrue(email.exists())
        self.assertTrue(email.first().verified)
        self.assertTrue(email.first().primary)

    def test_regular_user_has_no_email_address_record(self):
        user = make_user("henry")
        self.assertFalse(EmailAddress.objects.filter(user=user).exists())


# ---------------------------------------------------------------------------
# Serializer tests
# ---------------------------------------------------------------------------
class UserSerializerValidateUsernameTests(TestCase):
    def setUp(self):
        self.existing = make_user("existing")

    def test_collision_with_new_username_raises(self):
        # No instance -> a brand new user trying to take an existing username.
        serializer = UserSerializer(data={})
        with self.assertRaises((DRFValidationError, DjangoValidationError)):
            serializer.validate_username("existing")

    def test_same_username_on_same_instance_allowed(self):
        serializer = UserSerializer(instance=self.existing)
        # Updating without changing the username should be permitted.
        self.assertEqual(serializer.validate_username("existing"), "existing")

    def test_update_to_other_users_username_raises(self):
        other = make_user("other")
        serializer = UserSerializer(instance=other)
        with self.assertRaises((DRFValidationError, DjangoValidationError)):
            serializer.validate_username("existing")

    def test_new_unique_username_allowed(self):
        serializer = UserSerializer(data={})
        self.assertEqual(serializer.validate_username("brandnew"), "brandnew")


class UserSerializerOutputTests(TestCase):
    def test_serialized_fields_present(self):
        user = make_user("ivy", first_name="Ivy", last_name="League")
        profile = user.userprofile
        profile.over_eighteen = True
        profile.age = 30
        profile.previous_volunteer = True
        profile.dietary_restrictions = "vegetarian"
        profile.t_shirt_size = UserProfile.L
        profile.save()

        data = UserSerializer(instance=user).data
        expected_keys = {
            "username",
            "over_eighteen",
            "age",
            "previous_volunteer",
            "medical_restrictions",
            "special_interests",
            "dietary_restrictions",
            "student_volunteer_hours",
            "emergency_contact",
            "comments",
            "t_shirt_size",
            "requests",
            "is_staff",
        }
        self.assertTrue(expected_keys.issubset(set(data.keys())))
        self.assertEqual(data["username"], "ivy")
        self.assertTrue(data["over_eighteen"])
        self.assertEqual(data["age"], 30)
        self.assertEqual(data["dietary_restrictions"], "vegetarian")
        self.assertEqual(data["t_shirt_size"], "L")
        self.assertEqual(data["requests"], [])
        self.assertFalse(data["is_staff"])


# ---------------------------------------------------------------------------
# Adapter tests
# ---------------------------------------------------------------------------
class MyAccountAdapterTests(TestCase):
    def test_email_confirmation_url_format(self):
        adapter = MyAccountAdapter()
        request = RequestFactory().get("/")

        class FakeConfirmation:
            key = "abc123"

        url = adapter.get_email_confirmation_url(request, FakeConfirmation())
        self.assertEqual(
            url, "http://example.com/account/confirm-email/abc123/"
        )


# ---------------------------------------------------------------------------
# View / API tests
# ---------------------------------------------------------------------------
class UserViewSetAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse("userProfiles-list")
        self.admin = User.objects.create_superuser(
            username="boss", email="boss@example.com", password="bosspass123"
        )
        self.regular = make_user("regular")

    def test_unauthenticated_denied(self):
        response = self.client.get(self.list_url)
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_non_admin_denied(self):
        self.client.force_authenticate(user=self.regular)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_list_users(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [u["username"] for u in response.data]
        self.assertIn("boss", usernames)
        self.assertIn("regular", usernames)


class UserDetailsAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("rest_user_details")
        self.user = make_user("nina", first_name="Nina", last_name="Doe")

    def test_unauthenticated_denied(self):
        response = self.client.get(self.url)
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_retrieve_own_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "nina")
        self.assertEqual(response.data["t_shirt_size"], UserProfile.M)

    def test_update_profile_fields(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "over_eighteen": True,
            "age": 22,
            "previous_volunteer": True,
            "dietary_restrictions": "none",
            "t_shirt_size": "XL",
            "comments": "hello",
        }
        response = self.client.patch(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.userprofile.refresh_from_db()
        profile = self.user.userprofile
        self.assertTrue(profile.over_eighteen)
        self.assertEqual(profile.age, 22)
        self.assertTrue(profile.previous_volunteer)
        self.assertEqual(profile.dietary_restrictions, "none")
        self.assertEqual(profile.t_shirt_size, "XL")
        self.assertEqual(profile.comments, "hello")

    def test_update_keeping_same_username_allowed(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            self.url, {"username": "nina"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "nina")

    def test_update_to_taken_username_rejected(self):
        make_user("taken")
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            self.url, {"username": "taken"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)


class UserProfileCsvExportAdminTests(TestCase):
    """Lock in the admin profile CSV export after the N+1 query fix: it must
    still emit one row per selected user with that user's own profile data."""

    def setUp(self):
        from django.contrib import admin as django_admin

        self.factory = RequestFactory()
        self.admin_instance = django_admin.site._registry[User]
        self.staff = User.objects.create_superuser(
            username="exporter", email="exporter@example.com", password="pw12345678"
        )
        self.alice = make_user("alice", first_name="Alice", last_name="Zed")
        self.alice.userprofile.age = 30
        self.alice.userprofile.emergency_contact = "Alice Contact"
        self.alice.userprofile.save()
        self.bob = make_user("bob", first_name="Bob", last_name="Young")
        self.bob.userprofile.age = 25
        self.bob.userprofile.emergency_contact = "Bob Contact"
        self.bob.userprofile.save()

    def test_export_includes_each_users_own_profile(self):
        request = self.factory.get("/admin/")
        request.user = self.staff
        queryset = User.objects.filter(
            pk__in=[self.alice.pk, self.bob.pk]
        )
        response = self.admin_instance.export_user_profiles_as_csv(request, queryset)
        self.assertEqual(response["Content-Type"], "text/csv")
        body = response.content.decode()
        self.assertIn("Alice", body)
        self.assertIn("Alice Contact", body)
        self.assertIn("Bob", body)
        self.assertIn("Bob Contact", body)
        # Header + one row per user (ordered by last_name: Young, Zed).
        data_rows = [line for line in body.splitlines() if line.strip()]
        self.assertEqual(len(data_rows), 3)
