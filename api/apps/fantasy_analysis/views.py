from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response

from . import public
from .source import NoPage, latest_page
from .valuation import FAIR_METHODS, MARKETS, UNITS, board, spans


class Settings(serializers.Serializer):
    """The dashboard's controls: whose league, how much the future counts, and against which market."""

    league = serializers.CharField(required=False)
    rate = serializers.FloatField(min_value=0, max_value=1, default=0.2)
    years = serializers.IntegerField(min_value=1, max_value=10, default=10)
    unit = serializers.ChoiceField(UNITS, default="war")
    market = serializers.ChoiceField(MARKETS, default="ktc")
    fair = serializers.ChoiceField(FAIR_METHODS, default="rank")


def _page():
    try:
        return latest_page()
    except NoPage:
        raise NotFound("No dynasty data has been published yet.") from None


def _settings(request, page):
    form = Settings(data=request.query_params)
    form.is_valid(raise_exception=True)
    chosen = dict(form.validated_data)
    leagues = {lg["id"] for lg in page.get("leagues") or []}
    chosen.setdefault("league", page.get("default_league"))
    if chosen["league"] not in leagues:
        raise ValidationError({"league": f"Not one of: {', '.join(sorted(leagues))}."})
    return chosen


@api_view(["GET"])
def players(request):
    page = _page()
    chosen = _settings(request, page)
    valued = board(page, **chosen)
    return Response(
        {
            "meta": public.meta(page, sum(1 for p in valued if p["market"] is not None)),
            "leagues": [public.league(lg) for lg in page.get("leagues") or []],
            "settings": chosen,
            "rows": [public.board_row(p) for p in valued],
        }
    )


@api_view(["GET"])
def player(request, player_id):
    page = _page()
    chosen = _settings(request, page)
    row = next((r for r in page["rows"] if public.player_id(r) == player_id), None)
    if row is None:
        raise NotFound("No player with that id.")
    return Response(
        {
            "id": player_id,
            "name": row["name"],
            "facts": public.facts(page, row),
            "spans": [public.span(s) for s in spans(page, row, chosen["league"], chosen["rate"], chosen["years"])],
        }
    )


@api_view(["GET"])
def model(request):
    return Response(public.model(_page()))
