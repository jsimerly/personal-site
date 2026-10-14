"""Cached JSON reads from Google Cloud Storage.

Fetching a blob is a network round trip, so parsed results are kept in the
process-local cache for GCS_CACHE_SECONDS. Each Cloud Run instance has its own
cache, which is fine for data that changes rarely.

With GCS_LOCAL_ROOT set, reads (and listings) come from <root>/<bucket>/<path>
on disk instead, and writes go there too. The E2E lane uses that so it never
needs credentials or real data.
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


def list_names(bucket, prefix):
    """The names of every blob under `prefix`, sorted. Listing is a round trip
    too, so it's cached like reads; with GCS_LOCAL_ROOT it walks the folder."""

    def listing():
        if settings.GCS_LOCAL_ROOT:
            root = Path(settings.GCS_LOCAL_ROOT) / bucket
            names = (path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file())
            return sorted(name for name in names if name.startswith(prefix))
        return sorted(blob.name for blob in _client().list_blobs(bucket, prefix=prefix))

    return django_cache.get_or_set(f"gcs-list:{bucket}/{prefix}", listing, settings.GCS_CACHE_SECONDS)


def read_json(bucket, blob_path):
    def download():
        if settings.GCS_LOCAL_ROOT:
            return json.loads((Path(settings.GCS_LOCAL_ROOT) / bucket / blob_path).read_bytes())
        blob = _client().bucket(bucket).blob(blob_path)
        return json.loads(blob.download_as_bytes())

    return django_cache.get_or_set(f"gcs:{bucket}/{blob_path}", download, settings.GCS_CACHE_SECONDS)


def write_json(bucket, blob_path, data):
    """Store `data` as JSON at `blob_path`, only ever as a new blob: writing
    over an existing one fails rather than replacing it. That's all the API's
    create-only access allows anyway, and it means a stored record is final."""
    body = json.dumps(data, indent=2).encode()
    if settings.GCS_LOCAL_ROOT:
        path = Path(settings.GCS_LOCAL_ROOT) / bucket / blob_path
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("xb") as file:
            file.write(body)
        return
    # if_generation_match=0: create the blob only if it doesn't exist yet.
    _client().bucket(bucket).blob(blob_path).upload_from_string(body, content_type="application/json", if_generation_match=0)
