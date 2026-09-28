from .base import *  # noqa: F403

DEBUG = False
SECRET_KEY = env("SECRET_KEY")  # noqa: F405

# The Cloud Run service hostname(s), e.g. jacobsimerly-api-123456789.us-central1.run.app
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")  # noqa: F405

# Cloud Run terminates TLS and forwards plain HTTP.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# `check --deploy` findings that don't apply to a public, read-only JSON API on
# Cloud Run. CI runs that check strictly, so anything new still fails the build.
SILENCED_SYSTEM_CHECKS = [
    "security.W002",  # X-Frame-Options: JSON responses are never framed.
    "security.W003",  # CSRF: no cookies or sessions, and writes are refused anyway.
    "security.W004",  # HSTS: all of .app (so *.run.app) is HSTS-preloaded. Revisit for a custom domain.
    "security.W008",  # SSL redirect: Cloud Run's front end already redirects HTTP to HTTPS.
]

# Django only prints errors to the console when DEBUG is on. Cloud Run reads
# stdout/stderr, so without this a 500 in prod leaves no traceback anywhere.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "WARNING"},
}
