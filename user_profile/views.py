from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import viewsets


# Create your views here.


User = get_user_model()


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
