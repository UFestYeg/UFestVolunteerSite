from django.conf import settings


def frontend_url(request):
    """Expose the frontend base URL to templates (e.g. the admin header links).

    Empty string in production (same-origin relative links); an absolute URL
    pointing at the dev server in development.
    """
    return {"frontend_url": settings.FRONTEND_URL}
