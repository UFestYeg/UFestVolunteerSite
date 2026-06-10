from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase, override_settings

from backend.context_processors import frontend_url
from backend.serializers import NameRegistrationSerializer

User = get_user_model()


class FrontendUrlContextProcessorTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_returns_frontend_url_from_settings(self):
        request = self.factory.get("/")
        result = frontend_url(request)
        self.assertEqual(result, {"frontend_url": settings.FRONTEND_URL})

    @override_settings(FRONTEND_URL="https://example.com")
    def test_reflects_overridden_setting(self):
        request = self.factory.get("/")
        self.assertEqual(frontend_url(request), {"frontend_url": "https://example.com"})

    @override_settings(FRONTEND_URL="")
    def test_empty_url_in_production_like_setting(self):
        request = self.factory.get("/")
        self.assertEqual(frontend_url(request), {"frontend_url": ""})


class NameRegistrationSerializerTests(TestCase):
    def test_custom_signup_sets_names(self):
        user = User.objects.create_user(username="newbie", password="pw")
        serializer = NameRegistrationSerializer()
        serializer._validated_data = {"first_name": "Ada", "last_name": "Lovelace"}
        serializer.custom_signup(request=None, user=user)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "Ada")
        self.assertEqual(user.last_name, "Lovelace")

    def test_custom_signup_defaults_to_empty(self):
        user = User.objects.create_user(username="anon", password="pw")
        serializer = NameRegistrationSerializer()
        serializer._validated_data = {}
        serializer.custom_signup(request=None, user=user)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "")
        self.assertEqual(user.last_name, "")

    def test_serializer_declares_name_fields(self):
        serializer = NameRegistrationSerializer()
        self.assertIn("first_name", serializer.fields)
        self.assertIn("last_name", serializer.fields)


class IndexViewTests(TestCase):
    def test_index_renders_spa(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, "index.html")

    def test_unknown_route_falls_back_to_spa(self):
        resp = self.client.get("/some/spa/route")
        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, "index.html")
