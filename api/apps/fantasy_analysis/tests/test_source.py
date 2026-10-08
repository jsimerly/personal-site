from apps.fantasy_analysis.source import latest_page

from . import pages


def test_serves_the_newest_run_by_season_then_week_then_run_date(gcs_root):
    """The newest page wins: highest season, then week (numerically, so week 10 beats week 9), then run date."""
    for season, week, run_date in [(2025, 17, "2026-01-05"), (2026, 9, "2026-11-04"), (2026, 10, "2026-11-10"), (2026, 10, "2026-11-11")]:
        pages.publish(gcs_root, pages.page(as_of=f"{season} week {week} run {run_date}"), season, week, run_date)

    assert latest_page()["as_of"] == "2026 week 10 run 2026-11-11"


def test_ignores_files_that_are_not_page_exports(gcs_root):
    """Other model outputs beside the pages (parquet, metrics) are never mistaken for the page."""
    pages.publish(gcs_root)
    stray = gcs_root / "fantasy-football-ml" / "dynasty-value" / "pages" / "season=2027" / "week=1" / "metrics.json"
    stray.parent.mkdir(parents=True)
    stray.write_text("{}")

    assert latest_page()["season"] == 2026


def test_says_nothing_is_published_when_the_bucket_has_no_pages(api_client, gcs_root):
    """With no page published yet, every endpoint answers 404 with a plain reason, not a server error."""
    for path in ("/api/fantasy-analysis/players/", "/api/fantasy-analysis/players/avery-stone-qb/", "/api/fantasy-analysis/model/"):
        response = api_client.get(path)

        assert response.status_code == 404
        assert response.json() == {"detail": "No dynasty data has been published yet."}
