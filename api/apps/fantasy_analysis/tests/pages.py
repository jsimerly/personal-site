"""A small, made-up dynasty page file, shaped like the real export.

Numbers are chosen so values work out by hand. With a 20% discount over three
seasons the weights are 1, 0.8 and 0.64, so in the home league:

    player        pos  wins per season   career WAR  KTC
    Avery Stone   QB   1,   1,   1       2.44        7321
    Blake Rivers  RB   2,   0.5, 0       2.4         8888
    Finley Brook  WR   0.9, 0.9, 0.9     2.196       3017
    Emery Hill    WR   1.5, 0,   0       1.5         3511
    Casey Field   WR   0.5, 0.5, 0.5     1.22        (unpriced)
    Drew Lake     TE   0.25 a season     0.61        1203

Points above replacement are 100x the wins. The away league is the same except
Drew Lake is worth 3 wins a season there. The page also carries the private
parts of the real file (rosters, trades, draft slots, scraped prices), with
names and numbers that must never reach a response.
"""

import json
from pathlib import Path

from apps.fantasy_analysis.source import BUCKET

LABELS = ["ROS ’26", "’27", "’28"]

# Private: anything here showing up in a response is a leak.
MARKET_VALUES = [7321, 8888, 3017, 3511, 1203, 5111, 4222, 2333, 7777, 6666]
PEOPLE = ["Pat Fixture", "Morgan Fixture", "Robin Fixture"]


def _player(name, pos, wins, ktc, **extra):
    away = [3, 3, 3] if name == "Drew Lake" else wins
    league = lambda w: {  # noqa: E731
        "w": w,
        "v": [100 * x for x in w],
        "s": 1.0,
        "wl": [x / 2 for x in w],
        "wh": [x * 1.5 for x in w],
    }
    return {
        "name": name,
        "pos": pos,
        "team": "AAA",
        "age": 25.0,
        "ktc": ktc,
        "fc": extra.pop("fc", None),
        "rd_sf": extra.pop("rd_sf", None),
        "rd_1qb": None,
        "market_rank": 99,
        "iv_rank": 99,
        "fair": 5111,
        "mis_pct": 0.5,
        "match": "name",
        "fpts": 200.0,
        "games": 16,
        "td_games": 4,
        "td_ppg": 15.5,
        "iv": 1.0,
        "iv_pre": 150.0,
        "h": [180.0, 240.0, 220.0],
        "pg": [15.0, 14.0, 13.0],
        "band": {"lo": [None, None, 9.5], "hi": [None, None, 16.5]},
        "h1_ppg": 15.0,
        "h1_games": 12.0,
        "v": [100 * x for x in wins],
        "L": {"home": league(wins), "away": league(away)},
        **extra,
    }


def page(**overrides):
    content = {
        "as_of": "in-season, 2026 through week 4",
        "run_date": "2026-10-07",
        "season": 2026,
        "week": 4,
        "mode": "inseason",
        "career_backend": "tabpfn(model_version=v2)",
        "labels": LABELS,
        "prev_label": "Pts ’25",
        "spearman": 0.93141,
        "default_league": "home",
        "leagues": [
            {
                "id": "home",
                "name": "Home League",
                "teams": 10,
                "slots": {"QB": 1, "RB": 2, "WR": 3, "TE": 1, "SUPER_FLEX": 1},
                "starters": {"QB": 20, "RB": 24, "WR": 34, "TE": 12},
                "replacement": {"QB": 13.2, "RB": 8.8, "WR": 9.4, "TE": 7.1},
                "curve": {"mean": 120.5, "sd": 22.1, "n": 1400, "per10": 0.35, "a": 1.1, "b": 2.2},
                "offset": 0.0,
                "note": "",
                "primary": True,
            },
            {
                "id": "away",
                "name": "Away League",
                "teams": 12,
                "slots": {"QB": 1, "RB": 2, "WR": 2, "TE": 1, "FLEX": 1},
                "starters": {"QB": 12, "RB": 30, "WR": 28, "TE": 14},
                "replacement": {"QB": 17.0, "RB": 9.0, "WR": 9.1, "TE": 8.7},
                "curve": {"mean": 118.0, "sd": 21.0, "n": 900, "per10": 0.36, "a": 1.0, "b": 2.0},
                "offset": -0.8,
                "note": "scoring adjusted",
                "primary": False,
            },
        ],
        "rows": [
            _player("Avery Stone", "QB", [1, 1, 1], 7321, fc=4222),
            _player("Blake Rivers", "RB", [2, 0.5, 0], 8888),
            _player("Finley Brook", "WR", [0.9, 0.9, 0.9], 3017),
            _player("Emery Hill", "WR", [1.5, 0, 0], 3511, rd_sf=2333),
            _player("Casey Field", "WR", [0.5, 0.5, 0.5], None),
            _player("Drew Lake", "TE", [0.25, 0.25, 0.25], 1203),
        ],
        "teams": {"home": [{"rid": 1, "name": PEOPLE[0], "owner": False, "players": [["Avery Stone", "QB", 1, 1, 1, 6666]]}]},
        "trades": {"managers": [{"manager": PEOPLE[1]}], "trade_log": [{"a": PEOPLE[1], "b": PEOPLE[2], "ktc": 7777}]},
        "pick_slots": {"teams": [{"manager": PEOPLE[2]}]},
        "picks": {"rows": [[2027, 1, "Early", 4, 1.2, 6666]]},
        "performance": {
            "career_eval": {
                "start_season": 2010,
                "mae": [{"horizon": 1, "model": 34.2032, "decay": 36.0938, "carry_forward": 38.2966, "model_%_vs_carry": 10.7, "model_%_vs_decay": 5.2, "n_total": 8502, "folds": 15, "secret": PEOPLE[0]}],
                "rmse": [],
            },
            "value": {
                "horizon": 3,
                "first_cohort": 2020,
                "discount_rate": 0.2,
                "mean": {"spearman_iv_vs_realized": 0.66873, "spearman_ktc_vs_realized": 0.66376, "spearman_blend_vs_realized": 0.6844, "spearman_iv_vs_ktc": 0.89416},
                "bootstrap": {"iv_minus_ktc": 0.00521, "ci90_lo": -0.0678, "ci90_hi": 0.07584},
                "per_cohort": [{"cohort_T": 2020, "ktc_as_of": "2021-02-15", "n_players": 91, "spearman_iv_vs_realized": 0.68663, "spearman_ktc_vs_realized": 0.70886, "spearman_blend_vs_realized": 0.71693, "iv_minus_ktc": -0.0214}],
                "terciles": [{"tercile": "market cheap vs IV", "n": 124, "mean_beat_market_by": 13.45095}],
            },
            "inseason": {
                "cohorts": "2021-2024",
                "ros": [{"W": 3, "n": 681, "ros|model": 0.78358, "ros|ktc": 0.70442, "ros|last_season": 0.59997, "ros|to_date": 0.7004, "ros|blend": 0.75639}],
                "market_lag": [{"signal": "iv", "W": 3}],
            },
            "market": {
                "meta": {"cohorts": "2020-2024", "n_priced": 2541},
                "overall": [{"variant": "xgb", "horizon": 3, "n": 366, "rho_model": 0.68544, "rho_ktc": 0.67758, "edge_corr": 0.31939, "cheap_gap_real": 11.8595, "rich_gap_real": -9.4504, "cheap_wins_per_1k": 0.2444}],
                "by_position": [{"variant": "xgb", "horizon": 3, "position": "QB", "n": 82, "rho_model": 0.61992, "rho_ktc": 0.66513, "edge_corr": 0.28245, "cheap_gap_real": 10.1765, "rich_gap_real": -3.2}],
                "top_swaps": [{"sell": "Avery Stone", "sell_ktc": 7777, "buy": "Drew Lake", "buy_ktc": 6666}],
            },
            "experiments": [
                {"name": "tabpfn35_set_stacked_w", "n_features": 73, "horizon": 3, "cohorts": "2015-2022", "spearman_war_all": 0.60508, "mae_war_top": 0.47417, "spearman_iv_vs_realized": 0.69386, "spearman_ktc_vs_realized": 0.66411, "edge_corr": 0.36634, "params": PEOPLE[0], "commit": "0c6166f"}
            ],
        },
    }
    content.update(overrides)
    return content


def publish(root, content=None, season=2026, week=4, run_date="2026-10-07"):
    """Write a page where the pipeline would, under a local GCS root."""
    path = Path(root) / BUCKET / f"dynasty-value/pages/season={season}/week={week}/run_date={run_date}/projections.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(page() if content is None else content), encoding="utf-8")
    return path
