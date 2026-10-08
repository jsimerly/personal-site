"""Where the dynasty model's numbers come from.

The fantasy-analysis pipeline publishes one page file per run, at
gs://fantasy-football-ml/dynasty-value/pages/season=S/week=W/run_date=D/projections.json.
The site always serves the newest: the highest season, then week, then run.
"""

import re

from apps.core.gcs import list_names, read_json

BUCKET = "fantasy-football-ml"
PAGES = "dynasty-value/pages/"
_PAGE = re.compile(r"season=(\d+)/week=(\d+)/run_date=(\d{4}-\d{2}-\d{2})/projections\.json$")


class NoPage(Exception):
    """Nothing has been published under the pages prefix."""


def latest_page():
    runs = [
        ((int(match[1]), int(match[2]), match[3]), name)
        for name in list_names(BUCKET, PAGES)
        if (match := _PAGE.search(name))
    ]
    if not runs:
        raise NoPage
    return read_json(BUCKET, max(runs)[1])
