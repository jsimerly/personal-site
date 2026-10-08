"""The public site never repeats what the page file keeps private."""

import json

import pytest

from . import pages

ENDPOINTS = [
    "/api/fantasy-analysis/players/",
    "/api/fantasy-analysis/players/?market=fc&fair=curve&unit=par&league=away",
    "/api/fantasy-analysis/players/?market=rd_sf",
    "/api/fantasy-analysis/players/avery-stone-qb/",
    "/api/fantasy-analysis/players/emery-hill-wr/?league=away",
    "/api/fantasy-analysis/model/",
]
# Keys that carry the market's scraped prices, or rosters, trades, and their
# people. ("fair" and "market" name settings and a backtest section, so they're
# only off-limits inside a player, where a price would be.)
PRIVATE_KEYS = {"ktc", "fc", "rd_sf", "rd_1qb", "fair_pos", "match", "trades", "pick_slots", "picks", "owner", "manager", "top_swaps", "params", "commit"}
PRICE_KEYS_IN_A_PLAYER = {"fair", "market"}


def keys(value):
    if isinstance(value, dict):
        for key, inner in value.items():
            yield key
            yield from keys(inner)
    elif isinstance(value, list):
        for inner in value:
            yield from keys(inner)


def entries(value, key):
    """Every value stored under `key`, at any depth."""
    if isinstance(value, dict):
        for k, inner in value.items():
            if k == key:
                yield inner
            yield from entries(inner, key)
    elif isinstance(value, list):
        for inner in value:
            yield from entries(inner, key)


@pytest.mark.parametrize("path", ENDPOINTS)
def test_no_response_repeats_a_market_price_or_names_a_person(api_client, published, path):
    """No market price, roster, trade, manager, or other private field ever appears in a response."""
    response = api_client.get(path)
    assert response.status_code == 200
    text = response.content.decode()
    body = response.json()

    assert PRIVATE_KEYS.isdisjoint(keys(body))
    players = body.get("rows", []) + ([body] if "spans" in body else [])
    assert [sorted(PRICE_KEYS_IN_A_PLAYER & set(keys(player))) for player in players if PRICE_KEYS_IN_A_PLAYER & set(keys(player))] == []
    # A league's "teams" is how many teams it has, never a roster list.
    assert all(isinstance(teams, int) for teams in entries(body, "teams"))
    assert [person for person in pages.PEOPLE if person in text] == []
    assert [price for price in pages.MARKET_VALUES if str(price) in text] == []


def test_the_made_up_page_really_holds_the_private_data_these_tests_look_for():
    """The fixture must carry every private name and price, or the leak checks above would pass vacuously."""
    text = json.dumps(pages.page())

    assert all(person in text for person in pages.PEOPLE)
    assert all(str(price) in text for price in pages.MARKET_VALUES)
