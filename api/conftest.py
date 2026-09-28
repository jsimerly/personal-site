"""Suite-wide pytest rules and fixtures."""

from pathlib import Path

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

APPS_DIR = Path(__file__).resolve().parent / "apps"


def pytest_collection_modifyitems(items):
    """Every test states the behavior it protects: a missing docstring fails
    collection. The docstrings feed TESTING.md (scripts/build_test_catalog.py),
    the human-readable catalog of what this suite actually guarantees."""
    missing = [
        item.nodeid
        for item in items
        if Path(item.path).resolve().is_relative_to(APPS_DIR) and not (item.function.__doc__ or "").strip()
    ]
    if missing:
        listed = "\n  ".join(missing)
        raise pytest.UsageError(
            f"{len(missing)} test(s) have no docstring. Every test must state the behavior it protects:\n  {listed}"
        )


@pytest.fixture(autouse=True)
def _clear_cache():
    """The in-process cache holds GCS reads; it must never leak between tests."""
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def api_client():
    return APIClient()
