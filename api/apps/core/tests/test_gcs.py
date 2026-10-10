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


def test_list_names_lists_the_blobs_under_a_prefix(client):
    """list_names returns the names of every blob under the prefix, sorted."""
    client.list_blobs.return_value = [MagicMock(), MagicMock()]
    client.list_blobs.return_value[0].name = "data/b.json"
    client.list_blobs.return_value[1].name = "data/a.json"

    assert gcs.list_names("my-bucket", "data/") == ["data/a.json", "data/b.json"]
    client.list_blobs.assert_called_with("my-bucket", prefix="data/")


def test_repeat_listings_come_from_the_cache(client):
    """A second listing of the same prefix is served from the cache, not a second round trip."""
    client.list_blobs.return_value = []
    gcs.list_names("my-bucket", "data/")
    gcs.list_names("my-bucket", "data/")

    assert client.list_blobs.call_count == 1


def test_a_local_root_lists_files_on_disk_under_the_prefix(client, settings, tmp_path):
    """With GCS_LOCAL_ROOT set, listing walks <root>/<bucket> and keeps only names under the prefix."""
    for name in ("data/a.json", "data/deep/b.json", "other/c.json"):
        path = tmp_path / "my-bucket" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("{}")
    settings.GCS_LOCAL_ROOT = str(tmp_path)

    assert gcs.list_names("my-bucket", "data/") == ["data/a.json", "data/deep/b.json"]
    client.list_blobs.assert_not_called()


def test_write_json_creates_a_new_blob_and_never_overwrites_one(client):
    """write_json uploads the data as JSON on the condition that the blob doesn't exist yet."""
    gcs.write_json("my-bucket", "leads/a.json", {"contact": "jane@example.com"})

    client.bucket.assert_called_with("my-bucket")
    client.bucket.return_value.blob.assert_called_with("leads/a.json")
    client.bucket.return_value.blob.return_value.upload_from_string.assert_called_once_with(
        b'{\n  "contact": "jane@example.com"\n}', content_type="application/json", if_generation_match=0
    )


def test_a_local_root_writes_files_on_disk_and_never_overwrites_one(settings, tmp_path):
    """With GCS_LOCAL_ROOT set, write_json writes the file there, and writing the same name twice fails."""
    settings.GCS_LOCAL_ROOT = str(tmp_path)

    gcs.write_json("my-bucket", "leads/2026/a.json", {"n": 1})

    assert (tmp_path / "my-bucket" / "leads" / "2026" / "a.json").read_text() == '{\n  "n": 1\n}'
    with pytest.raises(FileExistsError):
        gcs.write_json("my-bucket", "leads/2026/a.json", {"n": 2})
