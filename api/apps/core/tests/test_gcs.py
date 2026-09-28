from unittest.mock import MagicMock

import pytest

from apps.core import gcs


@pytest.fixture
def client(monkeypatch):
    client = MagicMock()
    client.bucket.return_value.blob.return_value.download_as_bytes.return_value = b'{"hello": "world"}'
    monkeypatch.setattr(gcs, "_client", lambda: client)
    return client


def downloads(client):
    return client.bucket.return_value.blob.return_value.download_as_bytes.call_count


def test_read_json_parses_the_blob(client):
    """read_json downloads the named blob from the named bucket and returns it parsed."""
    assert gcs.read_json("my-bucket", "data/items.json") == {"hello": "world"}
    client.bucket.assert_called_with("my-bucket")
    client.bucket.return_value.blob.assert_called_with("data/items.json")


def test_repeat_reads_come_from_the_cache(client):
    """A second read of the same blob is served from the cache, not a second download."""
    gcs.read_json("my-bucket", "data/items.json")
    gcs.read_json("my-bucket", "data/items.json")

    assert downloads(client) == 1


def test_each_blob_is_cached_separately(client):
    """The cache is keyed by bucket and path, so different blobs never share an entry."""
    gcs.read_json("my-bucket", "a.json")
    gcs.read_json("my-bucket", "b.json")
    gcs.read_json("other-bucket", "a.json")

    assert downloads(client) == 3


def test_a_local_root_reads_from_disk_and_never_touches_gcs(client, settings, tmp_path):
    """With GCS_LOCAL_ROOT set (the E2E lane), reads come from <root>/<bucket>/<path> and GCS is never called."""
    blob = tmp_path / "my-bucket" / "data" / "items.json"
    blob.parent.mkdir(parents=True)
    blob.write_text('{"from": "disk"}')
    settings.GCS_LOCAL_ROOT = str(tmp_path)

    assert gcs.read_json("my-bucket", "data/items.json") == {"from": "disk"}
    client.bucket.assert_not_called()
