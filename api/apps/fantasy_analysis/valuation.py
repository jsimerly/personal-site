"""Every player's value at the reader's settings, ranked against the market.

The same math as the Dynasty Intrinsic Value dashboard, moved server-side so the
market's own numbers never leave it: the page sends a discount rate and horizon,
and gets back values, ranks, and mispricing as a percentage.

Each player carries per-season value for each league: points above replacement
(`v`) and wins above replacement (`w`, with a 20th-80th percentile floor and
ceiling, `wl` and `wh`). Value at a rate r over N seasons is the sum of the
first N seasons, season k weighted by (1 - r)^k. Fair price is what the market
would pay if it agreed with our value: by rank match (the player we rank k-th
gets the k-th highest price) or by a curve fit through every (value, price)
pair. Mispricing is (market - fair) / fair. Pure.
"""

from math import exp, log, log1p

UNITS = ("war", "war_ros", "par", "par_ros")
MARKETS = ("ktc", "fc", "rd_sf", "rd_1qb")
FAIR_METHODS = ("rank", "curve")
POSITIONS = ("QB", "RB", "WR", "TE")
# A market value below this is a fringe roster spot, too thin to price well.
LIQUID = 1500


def components(row, league):
    """A player's per-season value in one league, or points only if it has none."""
    return (row.get("L") or {}).get(league) or {"v": row.get("v") or []}


def discounted(values, rate, years):
    # Added left to right, as the dashboard does. (Python's sum() rounds more
    # carefully, which can flip the order of two players tied to the cent.)
    total = 0.0
    for k, value in enumerate(values[:years]):
        total += (value or 0) * (1 - rate) ** k
    return total


def power_fit(pairs):
    """Least squares on log(price) = a + b * log(1 + value); the fitted price at a value."""
    if len(pairs) < 3:
        return None
    xs = [log1p(max(value, 0)) for value, _ in pairs]
    ys = [log(price) for _, price in pairs]
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    sxx = sum((x - mx) ** 2 for x in xs)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    b = max(sxy / sxx if sxx > 0 else 0, 1e-6)
    a = my - b * mx
    return lambda value: exp(a) * (1 + max(value, 0)) ** b


def _rank_fair(players, key):
    prices = sorted((p["market"] for p in players), reverse=True)
    for player, price in zip(sorted(players, key=lambda p: -p["iv"]), prices):
        player[key] = price


def board(page, league, rate, years, unit, market, fair):
    """Every player valued and ranked, as dicts carrying the raw page row."""
    players = []
    for row in page["rows"]:
        c = components(row, league)
        v, w, wl, wh = c.get("v") or [], c.get("w"), c.get("wl"), c.get("wh")
        banded = bool(wl and wh)
        player = {
            "row": row,
            "par": discounted(v, rate, years),
            "war": discounted(w, rate, years) if w else None,
            "par_ros": v[0] if v else None,
            "war_ros": w[0] if w else None,
            "war_lo": discounted(wl, rate, years) if banded else None,
            "war_hi": discounted(wh, rate, years) if banded else None,
            "fair": None,
            "fair_pos": None,
        }
        player["iv"] = player[unit] or 0
        price = row.get(market)
        player["market"] = price if price and price > 0 else None
        players.append(player)

    for rank, player in enumerate(sorted(players, key=lambda p: -p["iv"]), start=1):
        player["rank"] = rank

    priced = [p for p in players if p["market"] is not None]
    if fair == "rank":
        _rank_fair(priced, "fair")
        for position in POSITIONS:
            _rank_fair([p for p in priced if p["row"]["pos"] == position], "fair_pos")
    else:
        pooled = power_fit([(p["iv"], p["market"]) for p in priced])
        by_position = {
            position: power_fit([(p["iv"], p["market"]) for p in priced if p["row"]["pos"] == position]) or pooled
            for position in POSITIONS
        }
        if pooled:
            for player in priced:
                player["fair"] = pooled(player["iv"])
                player["fair_pos"] = by_position[player["row"]["pos"]](player["iv"])

    for player in players:
        player["mis_pct"] = _mispricing(player["market"], player["fair"])
        player["mis_pct_pos"] = _mispricing(player["market"], player["fair_pos"])
        player["market_rank"] = player["model_rank"] = player["rank_gap"] = None
    for rank, player in enumerate(sorted(priced, key=lambda p: -p["market"]), start=1):
        player["market_rank"] = rank
    for rank, player in enumerate(sorted(priced, key=lambda p: -p["iv"]), start=1):
        player["model_rank"] = rank
        player["rank_gap"] = rank - player["market_rank"]
    return players


def _mispricing(market, fair):
    return None if market is None or fair is None else (market - fair) / max(fair, 1)


def spans(page, row, league, rate, years):
    """A player's season-by-season projection and value, with each season's weight."""
    c = components(row, league)
    band = row.get("band") or {}

    def at(values, i):
        return values[i] if values and i < len(values) else None

    return [
        {
            "label": label,
            "points": at(row.get("h"), i),
            "ppg": at(row.get("pg"), i),
            "ppg_lo": at(band.get("lo"), i),
            "ppg_hi": at(band.get("hi"), i),
            "par": at(c.get("v"), i),
            "war": at(c.get("w"), i),
            "war_lo": at(c.get("wl"), i),
            "war_hi": at(c.get("wh"), i),
            "weight": (1 - rate) ** i if i < years else 0,
        }
        for i, label in enumerate(page["labels"])
    ]
