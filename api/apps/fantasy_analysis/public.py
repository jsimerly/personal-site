"""What of the dynasty page is safe to put on a public site.

The page file behind the private dashboard also holds league rosters, trades,
and draft-slot odds that name real people, and the market's own scraped prices
(KTC, FantasyCalc). Everything here is built from an allowlist: players are
public figures, model output and backtest metrics are mine to share, and the
market shows only as ranks and percentages. A field added to the page later
stays private until it's named here.
"""

from django.utils.text import slugify

from .valuation import LIQUID


def player_id(row):
    return slugify(f"{row['name']} {row['pos']}")


def _round(value, places):
    return None if value is None else round(value, places)


def meta(page, priced):
    return {
        "as_of": page.get("as_of"),
        "run_date": page.get("run_date"),
        "season": page.get("season"),
        "week": page.get("week"),
        "mode": page.get("mode"),
        "career_backend": page.get("career_backend"),
        "labels": page.get("labels"),
        "prev_label": page.get("prev_label"),
        "n": len(page["rows"]),
        "n_priced": priced,
    }


def league(lg):
    curve = lg.get("curve") or {}
    return {
        "id": lg["id"],
        "name": lg["name"],
        "teams": lg.get("teams"),
        "slots": lg.get("slots"),
        "starters": lg.get("starters"),
        "replacement": lg.get("replacement"),
        "curve": {key: curve.get(key) for key in ("mean", "sd", "n", "per10")},
        "note": lg.get("note"),
        "primary": bool(lg.get("primary")),
    }


def board_row(player):
    row = player["row"]
    return {
        "id": player_id(row),
        "name": row["name"],
        "pos": row["pos"],
        "team": row.get("team"),
        "age": row.get("age"),
        "rank": player["rank"],
        "td_ppg": row.get("td_ppg"),
        "h1_ppg": row.get("h1_ppg"),
        "par_ros": _round(player["par_ros"], 1),
        "war_ros": _round(player["war_ros"], 3),
        "par": _round(player["par"], 1),
        "war": _round(player["war"], 3),
        "war_lo": _round(player["war_lo"], 3),
        "war_hi": _round(player["war_hi"], 3),
        "priced": player["market"] is not None,
        "liquid": player["market"] is not None and player["market"] >= LIQUID,
        "market_rank": player["market_rank"],
        "model_rank": player["model_rank"],
        "rank_gap": player["rank_gap"],
        "mis_pct": _round(player["mis_pct"], 3),
        "mis_pct_pos": _round(player["mis_pct_pos"], 3),
    }


def facts(page, row):
    h = row.get("h") or []
    return {
        "prev_label": page.get("prev_label"),
        "prev_points": row.get("fpts"),
        "prev_games": row.get("games"),
        "td_games": row.get("td_games"),
        "h1_games": row.get("h1_games"),
        "h1_points": h[0] if h else None,
        "preseason_value": row.get("iv_pre"),
    }


def span(s):
    return {
        "label": s["label"],
        "points": s["points"],
        "ppg": s["ppg"],
        "ppg_lo": s["ppg_lo"],
        "ppg_hi": s["ppg_hi"],
        "par": _round(s["par"], 1),
        "war": _round(s["war"], 3),
        "war_lo": _round(s["war_lo"], 3),
        "war_hi": _round(s["war_hi"], 3),
        "weight": _round(s["weight"], 4),
    }


def _pick(record, keys, places=4):
    return {key: (_round(record.get(key), places) if isinstance(record.get(key), float) else record.get(key)) for key in keys}


def model(page):
    """How the model is validated: backtest metrics only, no prices and no people."""
    perf = page.get("performance") or {}
    career = perf.get("career_eval") or {}
    value = perf.get("value") or {}
    inseason = perf.get("inseason") or {}
    market = perf.get("market") or {}
    experiments = perf.get("experiments") or []
    rho = ("variant", "horizon", "n", "rho_model", "rho_ktc", "edge_corr", "cheap_gap_real", "rich_gap_real")
    return {
        "run_date": page.get("run_date"),
        "career_backend": page.get("career_backend"),
        "spearman_vs_market": _round(page.get("spearman"), 4),
        "career": {
            "start_season": career.get("start_season"),
            "mae": [
                _pick(m, ("horizon", "model", "decay", "carry_forward", "model_%_vs_carry", "model_%_vs_decay", "n_total", "folds"))
                for m in career.get("mae") or []
            ],
        },
        "value": {
            "horizon": value.get("horizon"),
            "first_cohort": value.get("first_cohort"),
            "discount_rate": value.get("discount_rate"),
            "mean": _pick(
                value.get("mean") or {},
                ("spearman_iv_vs_realized", "spearman_ktc_vs_realized", "spearman_blend_vs_realized", "spearman_iv_vs_ktc"),
            ),
            "bootstrap": _pick(value.get("bootstrap") or {}, ("iv_minus_ktc", "ci90_lo", "ci90_hi")),
            "per_cohort": [
                _pick(
                    c,
                    (
                        "cohort_T",
                        "n_players",
                        "spearman_iv_vs_realized",
                        "spearman_ktc_vs_realized",
                        "spearman_blend_vs_realized",
                    ),
                )
                for c in value.get("per_cohort") or []
            ],
            "terciles": [_pick(t, ("tercile", "n", "mean_beat_market_by")) for t in value.get("terciles") or []],
        },
        "inseason": {
            "cohorts": inseason.get("cohorts"),
            "ros": [
                _pick(r, ("W", "n", "ros|model", "ros|ktc", "ros|last_season", "ros|to_date", "ros|blend"))
                for r in inseason.get("ros") or []
            ],
        },
        "market": {
            "cohorts": (market.get("meta") or {}).get("cohorts"),
            "overall": [_pick(m, rho) for m in market.get("overall") or []],
            "by_position": [_pick(m, (*rho, "position")) for m in market.get("by_position") or []],
        },
        "experiments": [
            _pick(
                e,
                (
                    "name",
                    "n_features",
                    "horizon",
                    "cohorts",
                    "spearman_war_all",
                    "mae_war_top",
                    "spearman_iv_vs_realized",
                    "spearman_ktc_vs_realized",
                    "edge_corr",
                ),
            )
            for e in experiments
        ],
    }
