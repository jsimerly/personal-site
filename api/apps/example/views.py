from rest_framework.decorators import api_view
from rest_framework.response import Response

# A template for real projects. Copy this app, then swap the constant for
# real data, e.g. `read_json("my-bucket", "my-project/items.json")` from
# apps.core.gcs.
ITEMS = [
    {"id": 1, "name": "First item"},
    {"id": 2, "name": "Second item"},
    {"id": 3, "name": "Third item"},
]


@api_view(["GET"])
def items(request):
    return Response(ITEMS)
