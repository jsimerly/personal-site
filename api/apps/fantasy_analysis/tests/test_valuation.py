import pytest

from apps.fantasy_analysis.valuation import board, discounted

from . import pages


def by_name(players):
    return {p["row"]["name"]: p for p in players}


def test_discounts_each_later_season_and_stops_at_the_horizon():
    """Season k counts (1 - rate)^k, and seasons past the horizon count nothing."""
    assert discounted([1, 1, 1], 0.2, 10) == pytest.approx(1 + 0.8 + 0.64)
    assert discounted([1, 1, 1], 0.2, 2) == pytest.approx(1.8)
    assert discounted([1, 1, 1], 1.0, 10) == 1


def test_values_and_ranks_every_player_at_the_chosen_rate():
    """Career WAR and PAR are the discounted seasons, and players rank by the chosen unit."""
    players = by_name(board(pages.page(), "home", 0.2, 10, "war", "ktc", "rank"))

    assert {name: p["war"] for name, p in players.items()} == pytest.approx(
        {"Avery Stone": 2.44, "Blake Rivers": 2.4, "Finley Brook": 2.196, "Emery Hill": 1.5, "Casey Field": 1.22, "Drew Lake": 0.61}
    )
    assert players["Avery Stone"]["par"] == pytest.approx(244)
    assert players["Avery Stone"]["war_lo"] == pytest.approx(1.22)
    assert players["Avery Stone"]["war_hi"] == pytest.approx(3.66)
    assert [p["row"]["name"] for p in sorted(players.values(), key=lambda p: p["rank"])] == [
        "Avery Stone",
        "Blake Rivers",
        "Finley Brook",
        "Emery Hill",
        "Casey Field",
        "Drew Lake",
    ]


def test_rest_of_season_units_ignore_the_discount_rate():
    """ROS value is the current season alone, so the rate and horizon don't move it."""
    for rate, years in [(0.0, 10), (0.9, 1)]:
        players = by_name(board(pages.page(), "home", rate, years, "war_ros", "ktc", "rank"))

        assert {name: p["iv"] for name, p in players.items()} == {
            "Avery Stone": 1,
            "Blake Rivers": 2,
            "Finley Brook": 0.9,
            "Emery Hill": 1.5,
            "Casey Field": 0.5,
            "Drew Lake": 0.25,
        }


def test_each_league_has_its_own_values():
    """A player is worth what he's worth in the chosen league's scoring and lineups."""
    home = by_name(board(pages.page(), "home", 0.2, 10, "war", "ktc", "rank"))
    away = by_name(board(pages.page(), "away", 0.2, 10, "war", "ktc", "rank"))

    assert home["Drew Lake"]["rank"] == 6
    assert away["Drew Lake"]["war"] == pytest.approx(7.32)
    assert away["Drew Lake"]["rank"] == 1


def test_rank_match_gives_each_player_the_price_at_their_model_rank():
    """The player we rank k-th among priced players is fair at the k-th highest price, overall and within their position."""
    players = by_name(board(pages.page(), "home", 0.2, 10, "war", "ktc", "rank"))

    assert {name: (p["market_rank"], p["model_rank"], p["rank_gap"]) for name, p in players.items()} == {
        "Avery Stone": (2, 1, -1),
        "Blake Rivers": (1, 2, 1),
        "Finley Brook": (4, 3, -1),
        "Emery Hill": (3, 4, 1),
        "Casey Field": (None, None, None),
        "Drew Lake": (5, 5, 0),
    }
    assert {name: p["mis_pct"] for name, p in players.items()} == pytest.approx(
        {
            "Avery Stone": (7321 - 8888) / 8888,
            "Blake Rivers": (8888 - 7321) / 7321,
            "Finley Brook": (3017 - 3511) / 3511,
            "Emery Hill": (3511 - 3017) / 3017,
            "Casey Field": None,
            "Drew Lake": 0,
        }
    )
    # Brook and Hill are the only priced WRs, so they're priced against each other.
    assert players["Finley Brook"]["mis_pct_pos"] == pytest.approx((3017 - 3511) / 3511)
    assert players["Avery Stone"]["mis_pct_pos"] == 0


def test_a_curve_fit_finds_nothing_mispriced_when_prices_follow_the_curve():
    """With prices exactly on a power law of value, curve-fit fair value equals the price: no mispricing."""
    content = pages.page()
    for row in content["rows"]:
        war = discounted(row["L"]["home"]["w"], 0.2, 10)
        row["ktc"] = 100 * (1 + war) ** 2

    for player in board(content, "home", 0.2, 10, "war", "ktc", "curve"):
        assert player["mis_pct"] == pytest.approx(0, abs=1e-9)
        assert player["mis_pct_pos"] == pytest.approx(0, abs=1e-9)


def test_ties_keep_the_page_order():
    """Players with equal value keep the order the page lists them in, as on the dashboard."""
    content = pages.page()
    for row in content["rows"]:
        row["L"]["home"]["w"] = [1, 1, 1]

    assert [p["row"]["name"] for p in sorted(board(content, "home", 0.2, 10, "war", "ktc", "rank"), key=lambda p: p["rank"])] == [
        row["name"] for row in content["rows"]
    ]
