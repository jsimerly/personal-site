import pytest

from . import pages


@pytest.fixture
def gcs_root(settings, tmp_path):
    """A local stand-in for GCS: reads and listings come from this folder."""
    settings.GCS_LOCAL_ROOT = str(tmp_path)
    return tmp_path


@pytest.fixture
def published(gcs_root):
    """The made-up page from pages.py, published as the only run."""
    pages.publish(gcs_root)
    return gcs_root
