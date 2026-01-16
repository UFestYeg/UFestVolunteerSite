from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from volunteer_categories.models import EventDate, Request
from django.db.models import Prefetch
from rest_auth.views import UserDetailsView

# Create your views here.


User = get_user_model()


def apply_event_date_filter(request, queryset):
    use_event_dates = request.query_params.get("use_event_dates")

    try:
        if (
            use_event_dates
            and use_event_dates.lower() == "true"
            and EventDate.dates.exists()
        ):
            start_date = EventDate.dates.earliest("event_date").event_date.strftime(
                "%Y-%m-%d"
            )
            end_date = EventDate.dates.latest("event_date").event_date.strftime(
                "%Y-%m-%d"
            )
            
            requests_qs = Request.requests.filter(
                role__category__start_time__range=[start_date, end_date]
            )
            
            queryset = queryset.prefetch_related(
                Prefetch('requests', queryset=requests_qs)
            )
    except Exception as e:
        print(f"Issue {e}")
    return queryset


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    permission_classes = [IsAdminUser]

    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all().order_by("-date_joined")
        return apply_event_date_filter(self.request, queryset)


class CustomUserDetailsView(UserDetailsView):
    def get_object(self):
        queryset = User.objects.filter(pk=self.request.user.pk)
        queryset = apply_event_date_filter(self.request, queryset)
        return queryset.first()

