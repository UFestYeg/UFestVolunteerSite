from ..models import UserProfile
from .serializers import UserProfileSerializer

from rest_framework import viewsets


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = UserProfile.users.all()
    serializer_class = UserProfileSerializer
