from django.urls import include, path

# Each project gets its own Django app under apps/ and its own /api/<project>/ prefix.
urlpatterns = [
    path("api/", include("apps.core.urls")),
    path("api/example/", include("apps.example.urls")),
    path("api/fantasy-analysis/", include("apps.fantasy_analysis.urls")),
    path("api/contact/", include("apps.contact.urls")),
]
