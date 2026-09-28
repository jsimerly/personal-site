from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health(request):
    # The frontend calls this on page load to wake the service before the
    # visitor opens a project that needs real data.
    return Response({"status": "ok"})
