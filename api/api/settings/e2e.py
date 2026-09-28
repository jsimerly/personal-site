"""Settings for the Playwright E2E lane (frontend/e2e/).

Prod-shaped on purpose: DEBUG off, JSON only, and CORS open to exactly the
origin the specs load the built site from, so a cross-origin mistake fails
here before it fails on GitHub Pages. GCS reads come from api/e2e/gcs/, so the
lane needs no credentials and never touches real data.
"""

from .base import *  # noqa: F403

SECRET_KEY = "e2e-only-not-a-secret"
DEBUG = False
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:5175"]
GCS_LOCAL_ROOT = str(BASE_DIR / "e2e" / "gcs")  # noqa: F405

# Keep the Playwright output readable: runserver logs only failed requests,
# and errors print their tracebacks (DEBUG is off, so Django otherwise wouldn't).
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "WARNING"},
    "loggers": {"django.server": {"handlers": ["console"], "level": "WARNING", "propagate": False}},
}
