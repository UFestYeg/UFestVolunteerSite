"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings

from .views import index
from user_profile.views import CustomUserDetailsView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("reset_password/", index, name="password_reset"),
    path("reset/<str:uidb64>/<str:token>/", index, name="password_reset_confirm"),
    path("account/confirm-email/<str:key>/", index, name="index"),
    # re_path(r"^", include("django.contrib.auth.urls")),
    re_path(r"^account/", include("allauth.urls")),
    path("api-auth/", include("rest_framework.urls")),
    # Override the default `rest-auth/user/` endpoint from `rest_auth.urls` with a custom view
    path("rest-auth/user/", CustomUserDetailsView.as_view(), name="rest_user_details"),
    path("rest-auth/", include("rest_auth.urls")),
    path("rest-auth/registration/", include("rest_auth.registration.urls")),
    path("api/", include("volunteer_categories.api.urls")),
    path("api/users/", include("user_profile.urls")),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

urlpatterns += [re_path(r".*", index, name="index")]

