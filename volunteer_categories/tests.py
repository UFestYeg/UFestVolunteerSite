from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import IntegrityError, transaction
from django.test import TestCase
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase

from volunteer_categories.models import (
    CategoryType,
    EventDate,
    Request,
    Role,
    VolunteerCategory,
)

User = get_user_model()


def make_category(title="Greeters", category_type=None, hours_offset=0):
    start = timezone.now() + timedelta(hours=hours_offset)
    end = start + timedelta(hours=4)
    return VolunteerCategory.categories.create(
        title=title,
        description="desc",
        start_time=start,
        end_time=end,
        category_type=category_type,
    )


# ---------------------------------------------------------------------------
# Model tests
# ---------------------------------------------------------------------------
class CategoryTypeModelTests(TestCase):
    def test_str(self):
        ct = CategoryType.types.create(tag="Vendors")
        self.assertEqual(str(ct), "Category: Vendors")

    def test_tag_persisted(self):
        ct = CategoryType.types.create(tag="Kids")
        self.assertEqual(CategoryType.types.get(pk=ct.pk).tag, "Kids")


class VolunteerCategoryModelTests(TestCase):
    def setUp(self):
        self.ct = CategoryType.types.create(tag="Marketing")
        self.category = make_category(category_type=self.ct)

    def test_str_contains_title(self):
        self.assertIn("Greeters", str(self.category))
        self.assertTrue(str(self.category).startswith("Category Greeters"))

    def test_category_type_relationship(self):
        self.assertEqual(self.category.category_type, self.ct)
        self.assertIn(self.category, self.ct.category_types.all())

    def test_number_of_positions_none_without_roles(self):
        self.assertIsNone(self.category.number_of_positions)

    def test_number_of_positions_sums_roles(self):
        Role.roles.create(
            title="A", description="d", number_of_positions=3, category=self.category
        )
        Role.roles.create(
            title="B", description="d", number_of_positions=2, category=self.category
        )
        self.assertEqual(self.category.number_of_positions, 5)

    def test_number_of_open_positions_accounts_for_accepted(self):
        role = Role.roles.create(
            title="A", description="d", number_of_positions=3, category=self.category
        )
        user = User.objects.create_user(username="u1", password="pw")
        Request.requests.create(user=user, role=role, status=Request.ACCEPTED)
        self.assertEqual(self.category.number_of_open_positions, 2)


class RoleModelTests(TestCase):
    def setUp(self):
        self.ct = CategoryType.types.create(tag="Cafe")
        self.category = make_category(category_type=self.ct)
        self.role = Role.roles.create(
            title="Barista",
            description="make coffee",
            number_of_positions=2,
            category=self.category,
        )

    def test_default_number_of_positions(self):
        role = Role.roles.create(
            title="Helper", description="d", category=self.category
        )
        self.assertEqual(role.number_of_positions, 1)

    def test_str_contains_title_and_positions(self):
        text = str(self.role)
        self.assertIn("Barista", text)
        self.assertIn("#2", text)

    def test_category_relationship(self):
        self.assertIn(self.role, self.category.roles.all())

    def test_open_positions_full_when_no_requests(self):
        self.assertEqual(self.role.number_of_open_positions, 2)

    def test_open_positions_decreases_with_accepted(self):
        user = User.objects.create_user(username="ru", password="pw")
        Request.requests.create(user=user, role=self.role, status=Request.ACCEPTED)
        self.assertEqual(self.role.number_of_open_positions, 1)

    def test_pending_request_does_not_reduce_open_positions(self):
        user = User.objects.create_user(username="rp", password="pw")
        Request.requests.create(user=user, role=self.role, status=Request.PENDING)
        self.assertEqual(self.role.number_of_open_positions, 2)


class RequestModelTests(TestCase):
    def setUp(self):
        self.ct = CategoryType.types.create(tag="Beer Gardens")
        self.category = make_category(category_type=self.ct)
        self.role = Role.roles.create(
            title="Pourer", description="d", number_of_positions=2, category=self.category
        )
        self.user = User.objects.create_user(username="req", password="pw")

    def test_default_status_is_pending(self):
        req = Request.requests.create(user=self.user, role=self.role)
        self.assertEqual(req.status, Request.PENDING)

    def test_str(self):
        req = Request.requests.create(user=self.user, role=self.role)
        self.assertEqual(str(req), f"{self.category.title}-{self.role.title}: PENDING")

    def test_relationships(self):
        req = Request.requests.create(user=self.user, role=self.role)
        self.assertIn(req, self.user.requests.all())
        self.assertIn(req, self.role.requests.all())

    def test_unique_user_role_constraint(self):
        Request.requests.create(user=self.user, role=self.role)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Request.requests.create(user=self.user, role=self.role)


class EventDateModelTests(TestCase):
    def test_label_is_weekday_name(self):
        # 2025-05-24 is a Saturday
        dt = timezone.make_aware(timezone.datetime(2025, 5, 24, 9, 0))
        ed = EventDate.dates.create(event_date=dt)
        self.assertEqual(ed.label, dt.strftime("%A"))

    def test_str_contains_label(self):
        dt = timezone.make_aware(timezone.datetime(2025, 5, 24, 9, 0))
        ed = EventDate.dates.create(event_date=dt)
        self.assertIn(ed.label, str(ed))
        self.assertIn("Event Date", str(ed))


# ---------------------------------------------------------------------------
# API tests
# ---------------------------------------------------------------------------
class ApiBaseTestCase(APITestCase):
    def setUp(self):
        cache.clear()  # reset DRF throttle counters between tests
        self.ct = CategoryType.types.create(tag="Workshops")
        self.category = make_category(category_type=self.ct)
        self.role = Role.roles.create(
            title="Setup",
            description="set up tents",
            number_of_positions=2,
            category=self.category,
        )
        self.user = User.objects.create_user(username="member", password="pw")
        self.staff = User.objects.create_user(
            username="boss", password="pw", is_staff=True
        )

    def role_payload(self):
        return {
            "id": self.role.id,
            "title": self.role.title,
            "description": self.role.description,
            "number_of_positions": self.role.number_of_positions,
        }


class VolunteerCategoryApiTests(ApiBaseTestCase):
    def test_list_requires_authentication(self):
        resp = self.client.get("/api/positions/")
        self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_authenticated_can_list(self):
        self.client.force_authenticate(self.user)
        resp = self.client.get("/api/positions/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titles = [c["title"] for c in resp.json()]
        self.assertIn(self.category.title, titles)

    def test_detail_includes_roles_and_counts(self):
        self.client.force_authenticate(self.user)
        resp = self.client.get(f"/api/positions/{self.category.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        self.assertEqual(data["number_of_positions"], 2)
        self.assertEqual(len(data["roles"]), 1)

    def test_non_staff_cannot_create(self):
        self.client.force_authenticate(self.user)
        payload = {
            "title": "New",
            "description": "d",
            "start_time": timezone.now().isoformat(),
            "end_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "category_type": {"tag": self.ct.tag},
        }
        resp = self.client.post("/api/positions/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_create(self):
        self.client.force_authenticate(self.staff)
        payload = {
            "title": "Teardown",
            "description": "d",
            "start_time": timezone.now().isoformat(),
            "end_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "category_type": {"tag": self.ct.tag},
        }
        resp = self.client.post("/api/positions/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(VolunteerCategory.categories.filter(title="Teardown").exists())

    def test_with_requests_action(self):
        self.client.force_authenticate(self.user)
        Request.requests.create(user=self.user, role=self.role, status=Request.ACCEPTED)
        resp = self.client.get("/api/positions/with-requests/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        category = next(c for c in data if c["id"] == self.category.id)
        self.assertEqual(len(category["roles"][0]["requests"]), 1)


class CategoryTypeApiTests(ApiBaseTestCase):
    def test_list_open_to_anonymous(self):
        resp = self.client.get("/api/categories/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        tags = [c["tag"] for c in resp.json()]
        self.assertIn(self.ct.tag, tags)


class EventDateApiTests(ApiBaseTestCase):
    def test_list_event_dates(self):
        dt = timezone.make_aware(timezone.datetime(2025, 5, 24, 9, 0))
        EventDate.dates.create(event_date=dt)
        resp = self.client.get("/api/eventdates/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.json()), 1)
        self.assertIn("label", resp.json()[0])


class RoleApiTests(ApiBaseTestCase):
    def test_list_requires_authentication(self):
        resp = self.client.get("/api/roles/")
        self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_authenticated_list(self):
        self.client.force_authenticate(self.user)
        resp = self.client.get("/api/roles/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(any(r["id"] == self.role.id for r in resp.json()))


class CategoryOfTypeApiTests(ApiBaseTestCase):
    def test_retrieve_categories_of_type(self):
        self.client.force_authenticate(self.user)
        resp = self.client.get(f"/api/positions/category/{self.ct.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = [c["id"] for c in resp.json()]
        self.assertIn(self.category.id, ids)


@patch("volunteer_categories.api.serializers.mail.send")
class RequestApiTests(ApiBaseTestCase):
    def test_list_open_to_anonymous(self, mock_send):
        Request.requests.create(user=self.user, role=self.role)
        resp = self.client.get("/api/requests/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.json()), 1)

    def test_anonymous_cannot_create(self, mock_send):
        payload = {"user": self.user.id, "status": Request.PENDING, "role": self.role_payload()}
        resp = self.client.post("/api/requests/", payload, format="json")
        self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))
        mock_send.assert_not_called()

    def test_authenticated_create(self, mock_send):
        self.client.force_authenticate(self.user)
        payload = {"user": self.user.id, "status": Request.PENDING, "role": self.role_payload()}
        resp = self.client.post("/api/requests/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Request.requests.filter(user=self.user, role=self.role).exists()
        )
        mock_send.assert_called_once()

    def test_accept_flow_updates_status(self, mock_send):
        self.client.force_authenticate(self.staff)
        req = Request.requests.create(user=self.user, role=self.role, status=Request.PENDING)
        payload = {
            "user": self.user.id,
            "status": Request.ACCEPTED,
            "role": self.role_payload(),
        }
        resp = self.client.put(f"/api/requests/{req.id}/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        req.refresh_from_db()
        self.assertEqual(req.status, Request.ACCEPTED)
        self.assertEqual(self.role.number_of_open_positions, 1)

    def test_accept_blocked_when_role_full(self, mock_send):
        self.role.number_of_positions = 1
        self.role.save()
        other = User.objects.create_user(username="other", password="pw")
        Request.requests.create(user=other, role=self.role, status=Request.ACCEPTED)
        req = Request.requests.create(user=self.user, role=self.role, status=Request.PENDING)
        self.client.force_authenticate(self.staff)
        payload = {
            "user": self.user.id,
            "status": Request.ACCEPTED,
            "role": self.role_payload(),
        }
        resp = self.client.put(f"/api/requests/{req.id}/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        req.refresh_from_db()
        self.assertNotEqual(req.status, Request.ACCEPTED)

    @patch("volunteer_categories.api.views.mail.send")
    def test_delete_request(self, mock_view_send, mock_send):
        self.client.force_authenticate(self.user)
        req = Request.requests.create(user=self.user, role=self.role)
        resp = self.client.delete(f"/api/requests/{req.id}/")
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Request.requests.filter(pk=req.id).exists())


class MyScheduleICSTests(ApiBaseTestCase):
    def test_requires_authentication(self):
        resp = self.client.get("/api/my_schedule.ics")
        self.assertIn(
            resp.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_returns_calendar_with_accepted_shift(self):
        Request.requests.create(
            user=self.user, role=self.role, status=Request.ACCEPTED
        )
        self.client.force_authenticate(self.user)
        resp = self.client.get("/api/my_schedule.ics")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp["Content-Type"].startswith("text/calendar"))
        self.assertIn("attachment", resp["Content-Disposition"])
        self.assertIn("ufest-volunteer-schedule.ics", resp["Content-Disposition"])
        body = resp.content.decode()
        self.assertIn("BEGIN:VCALENDAR", body)
        self.assertIn("BEGIN:VEVENT", body)
        self.assertIn(f"{self.category.title} - {self.role.title}", body)
        self.assertEqual(body.count("BEGIN:VEVENT"), 1)

    def test_excludes_non_accepted_requests(self):
        Request.requests.create(
            user=self.user, role=self.role, status=Request.PENDING
        )
        self.client.force_authenticate(self.user)
        resp = self.client.get("/api/my_schedule.ics")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        body = resp.content.decode()
        self.assertNotIn("BEGIN:VEVENT", body)

    def test_only_includes_own_shifts(self):
        other = User.objects.create_user(username="someone", password="pw")
        Request.requests.create(
            user=other, role=self.role, status=Request.ACCEPTED
        )
        self.client.force_authenticate(self.user)
        resp = self.client.get("/api/my_schedule.ics")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        body = resp.content.decode()
        self.assertNotIn("BEGIN:VEVENT", body)


# ---------------------------------------------------------------------------
# cron / tasks tests
# ---------------------------------------------------------------------------
class CronTests(TestCase):
    @patch("volunteer_categories.cron.call_command")
    def test_send_mail_job_calls_command(self, mock_call):
        from volunteer_categories import cron

        cron.send_mail_job()
        mock_call.assert_called_once_with("send_queued_mail")

    @patch("volunteer_categories.cron.call_command")
    def test_delete_mail_job_calls_command(self, mock_call):
        from volunteer_categories import cron

        cron.delete_mail_job()
        mock_call.assert_called_once_with(
            "cleanup_mail", "--days=30", "--delete-attachments"
        )


class TasksTests(TestCase):
    @patch("volunteer_categories.tasks.call_command")
    def test_send_mail_job_calls_command(self, mock_call):
        from volunteer_categories import tasks

        tasks.send_mail_job()
        mock_call.assert_called_once_with("send_queued_mail")
