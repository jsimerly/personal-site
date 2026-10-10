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

# The contact form's leads land in e2e/gcs/<LEADS_BUCKET>/ and its emails in
# e2e/outbox/ (both gitignored), so the specs can check the whole path.
MAILERS = {
    "default": {
        "BACKEND": "django.core.mail.backends.filebased.EmailBackend",
        "OPTIONS": {"file_path": str(BASE_DIR / "e2e" / "outbox")},  # noqa: F405
    }
}
LEADS_NOTIFY_TO = ["jacob@e2e.invalid"]
# Every spec submits from 127.0.0.1, on a phone and a laptop at once.
REST_FRAMEWORK = {**REST_FRAMEWORK, "DEFAULT_THROTTLE_RATES": {"contact": "1000/hour"}}  # noqa: F405

# Keep the Playwright output readable: runserver logs only failed requests,
# and errors print their tracebacks (DEBUG is off, so Django otherwise wouldn't).
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "WARNING"},
    "loggers": {"django.server": {"handlers": ["console"], "level": "WARNING", "propagate": False}},
}
