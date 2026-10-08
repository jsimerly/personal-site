from django.urls import path

from . import views

urlpatterns = [
    path("players/", views.players),
    path("players/<slug:player_id>/", views.player),
    path("model/", views.model),
]
