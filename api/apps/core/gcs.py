"""Cached JSON reads from Google Cloud Storage.

Fetching a blob is a network round trip, so parsed results are kept in the
process-local cache for GCS_CACHE_SECONDS. Each Cloud Run instance has its own
cache, which is fine for data that changes rarely.

With GCS_LOCAL_ROOT set, reads come from <root>/<bucket>/<path> on disk
instead. The E2E lane uses that so it never needs credentials or real data.
"""

import json
from functools import cache
from pathlib import Path

from django.conf import settings
from django.core.cache import cache as django_cache
from google.cloud import storage


@cache
def _client():
    # One client per process. Credentials come from the Cloud Run service
    # account in prod and `gcloud auth application-default login` locally.
    return storage.Client()


def read_json(bucket, blob_path):
    def download():
        if settings.GCS_LOCAL_ROOT:
            return json.loads((Path(settings.GCS_LOCAL_ROOT) / bucket / blob_path).read_bytes())
        blob = _client().bucket(bucket).blob(blob_path)
        return json.loads(blob.download_as_bytes())

    return django_cache.get_or_set(f"gcs:{bucket}/{blob_path}", download, settings.GCS_CACHE_SECONDS)
