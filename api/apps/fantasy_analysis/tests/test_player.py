URL = "/api/fantasy-analysis/players/avery-stone-qb/"


def test_shows_a_players_season_by_season_projection_and_weights(api_client, published):
    """The detail lists each season's projection and value, weighted at the reader's rate within the horizon."""
    response = api_client.get(URL, {"rate": 0.2, "years": 2})

    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Avery Stone"
    assert body["spans"] == [
        {"label": "ROS ’26", "points": 180.0, "ppg": 15.0, "ppg_lo": None, "ppg_hi": None, "par": 100.0, "war": 1.0, "war_lo": 0.5, "war_hi": 1.5, "weight": 1.0},
        {"label": "’27", "points": 240.0, "ppg": 14.0, "ppg_lo": None, "ppg_hi": None, "par": 100.0, "war": 1.0, "war_lo": 0.5, "war_hi": 1.5, "weight": 0.8},
        {"label": "’28", "points": 220.0, "ppg": 13.0, "ppg_lo": 9.5, "ppg_hi": 16.5, "par": 100.0, "war": 1.0, "war_lo": 0.5, "war_hi": 1.5, "weight": 0},
    ]
    assert body["facts"] == {
        "prev_label": "Pts ’25",
        "prev_points": 200.0,
        "prev_games": 16,
        "td_games": 4,
        "h1_games": 12.0,
        "h1_points": 180.0,
        "preseason_value": 150.0,
    }


def test_values_seasons_in_the_chosen_league(api_client, published):
    """The per-season wins are the chosen league's."""
    spans = api_client.get("/api/fantasy-analysis/players/drew-lake-te/", {"league": "away"}).json()["spans"]

    assert [s["war"] for s in spans] == [3.0, 3.0, 3.0]


def test_an_unknown_player_is_a_404(api_client, published):
    """A player id that isn't in the current run answers 404."""
    response = api_client.get("/api/fantasy-analysis/players/nobody-qb/")

    assert response.status_code == 404
    assert response.json() == {"detail": "No player with that id."}
