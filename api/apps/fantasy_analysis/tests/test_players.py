import pytest

URL = "/api/fantasy-analysis/players/"


def rows_by_name(response):
    return {row["name"]: row for row in response.json()["rows"]}


def test_lists_every_player_valued_at_the_dashboards_defaults(api_client, published):
    """With no settings, players are valued in the default league at 20% a year over 10 years, by career WAR against KTC."""
    response = api_client.get(URL)

    assert response.status_code == 200
    body = response.json()
    assert body["settings"] == {"league": "home", "rate": 0.2, "years": 10, "unit": "war", "market": "ktc", "fair": "rank"}
    assert rows_by_name(response)["Avery Stone"] == {
        "id": "avery-stone-qb",
        "name": "Avery Stone",
        "pos": "QB",
        "team": "AAA",
        "age": 25.0,
        "rank": 1,
        "td_ppg": 15.5,
        "h1_ppg": 15.0,
        "par_ros": 100,
        "war_ros": 1,
        "par": 244.0,
        "war": 2.44,
        "war_lo": 1.22,
        "war_hi": 3.66,
        "priced": True,
        "liquid": True,
        "market_rank": 2,
        "model_rank": 1,
        "rank_gap": -1,
        "mis_pct": round((7321 - 8888) / 8888, 3),
        "mis_pct_pos": 0.0,
    }


def test_flags_unpriced_and_thinly_priced_players(api_client, published):
    """A player the market doesn't price has no market rank; one priced under 1,500 is flagged as not liquid."""
    rows = rows_by_name(api_client.get(URL))

    assert (rows["Casey Field"]["priced"], rows["Casey Field"]["market_rank"], rows["Casey Field"]["mis_pct"]) == (False, None, None)
    assert (rows["Drew Lake"]["priced"], rows["Drew Lake"]["liquid"]) == (True, False)


def test_the_readers_settings_change_the_values_and_ranks(api_client, published):
    """Rate, horizon, unit, and league all come from the query: here, undiscounted points over two seasons."""
    rows = rows_by_name(api_client.get(URL, {"rate": 0, "years": 2, "unit": "par", "league": "away"}))

    assert {name: (row["par"], row["rank"]) for name, row in rows.items()} == {
        "Avery Stone": (200.0, 3),
        "Blake Rivers": (250.0, 2),
        "Finley Brook": (180.0, 4),
        "Emery Hill": (150.0, 5),
        "Casey Field": (100.0, 6),
        "Drew Lake": (600.0, 1),
    }


def test_ranks_against_whichever_market_is_chosen(api_client, published):
    """Choosing another market prices against it: only FantasyCalc's one priced player has a market rank."""
    body = api_client.get(URL, {"market": "fc"}).json()

    assert body["meta"]["n_priced"] == 1
    assert [row["name"] for row in body["rows"] if row["priced"]] == ["Avery Stone"]


def test_describes_the_run_and_each_league(api_client, published):
    """The response says which run it is and describes each league's format, so the page can label itself."""
    body = api_client.get(URL).json()

    assert body["meta"] == {
        "as_of": "in-season, 2026 through week 4",
        "run_date": "2026-10-07",
        "season": 2026,
        "week": 4,
        "mode": "inseason",
        "career_backend": "tabpfn(model_version=v2)",
        "labels": ["ROS ’26", "’27", "’28"],
        "prev_label": "Pts ’25",
        "n": 6,
        "n_priced": 5,
    }
    assert body["leagues"][0] == {
        "id": "home",
        "name": "Home League",
        "teams": 10,
        "slots": {"QB": 1, "RB": 2, "WR": 3, "TE": 1, "SUPER_FLEX": 1},
        "starters": {"QB": 20, "RB": 24, "WR": 34, "TE": 12},
        "replacement": {"QB": 13.2, "RB": 8.8, "WR": 9.4, "TE": 7.1},
        "curve": {"mean": 120.5, "sd": 22.1, "n": 1400, "per10": 0.35},
        "note": "",
        "primary": True,
    }


@pytest.mark.parametrize(
    "query",
    [{"rate": 1.5}, {"rate": "fast"}, {"years": 0}, {"years": 11}, {"unit": "vibes"}, {"market": "ebay"}, {"fair": "guess"}, {"league": "nope"}],
)
def test_refuses_settings_outside_the_dashboards_range(api_client, published, query):
    """A rate outside 0-1, a horizon outside 1-10 seasons, or an unknown unit, market, method, or league is a 400."""
    response = api_client.get(URL, query)

    assert response.status_code == 400
    assert list(response.json()) == list(query)
