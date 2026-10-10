import json
import uuid
from datetime import datetime
from pathlib import Path

import pytest

from apps.contact import leads

NOW = datetime(2026, 10, 10, 14, 3, 9, tzinfo=leads.EASTERN)


@pytest.fixture
def gcs_root(settings, tmp_path):
    settings.GCS_LOCAL_ROOT = str(tmp_path)
    return tmp_path


@pytest.fixture
def frozen(monkeypatch):
    """A fixed clock and file name, so stored leads can be checked exactly."""
    monkeypatch.setattr(leads, "now", lambda: NOW)
    monkeypatch.setattr(leads.uuid, "uuid4", lambda: uuid.UUID("12345678123456781234567812345678"))


@pytest.fixture
def stored(gcs_root, settings):
    """Every lead written so far, as {path in the bucket: record}."""

    def read():
        bucket = Path(gcs_root) / settings.LEADS_BUCKET
        return {path.relative_to(bucket).as_posix(): json.loads(path.read_text()) for path in sorted(bucket.rglob("*.json"))}

    return read
