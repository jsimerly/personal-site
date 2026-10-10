from django.urls import URLPattern, get_resolver
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView


class WritableView(APIView):
    def get(self, request):
        return Response({"read": True})

    def post(self, request):
        return Response({"wrote": True})


def test_reads_are_allowed():
    """Anyone can GET: the API is public and needs no login."""
    response = WritableView.as_view()(APIRequestFactory().get("/"))

    assert response.status_code == 200


def test_writes_are_refused_even_when_a_view_defines_them():
    """The read-only rule lives in the default permissions, so a view that defines post still refuses it."""
    response = WritableView.as_view()(APIRequestFactory().post("/", {}))

    assert response.status_code == 403


def test_the_site_origin_is_allowed(api_client):
    """The site at jacob-simerly.com may read the API cross-origin."""
    response = api_client.get("/api/health/", HTTP_ORIGIN="https://jacob-simerly.com")

    assert response["Access-Control-Allow-Origin"] == "https://jacob-simerly.com"


def test_other_origins_are_not_allowed(api_client):
    """Any other site gets no CORS header, so browsers block it from reading responses."""
    response = api_client.get("/api/health/", HTTP_ORIGIN="https://somewhere-else.example")

    assert "Access-Control-Allow-Origin" not in response


def views(patterns, prefix=""):
    """Every routed view in the API, as (route, view)."""
    for pattern in patterns:
        if isinstance(pattern, URLPattern):
            yield prefix + str(pattern.pattern), pattern.callback
        else:
            yield from views(pattern.url_patterns, prefix + str(pattern.pattern))


def test_the_contact_form_is_the_only_view_that_takes_writes():
    """Every routed view keeps the read-only default except the contact form, which lifts it explicitly."""
    writable = [
        route
        for route, view in views(get_resolver().url_patterns)
        if AllowAny in getattr(getattr(view, "cls", None), "permission_classes", [])
    ]

    assert writable == ["api/contact/"]
