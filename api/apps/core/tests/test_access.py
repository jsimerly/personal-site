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


def test_github_pages_origin_is_allowed(api_client):
    """The GitHub Pages site may read the API cross-origin."""
    response = api_client.get("/api/health/", HTTP_ORIGIN="https://jsimerly.github.io")

    assert response["Access-Control-Allow-Origin"] == "https://jsimerly.github.io"


def test_other_origins_are_not_allowed(api_client):
    """Any other site gets no CORS header, so browsers block it from reading responses."""
    response = api_client.get("/api/health/", HTTP_ORIGIN="https://somewhere-else.example")

    assert "Access-Control-Allow-Origin" not in response
