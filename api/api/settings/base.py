from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Local overrides live in api/.env (gitignored). On Cloud Run the same names are
# plain environment variables, so a missing file is fine.
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

# The API is public and read-only: nobody logs in, and the only thing it
# writes is a lead from the site's "Work with me" form (apps.contact), to a
# bucket. That lets it skip django.contrib.auth, sessions, CSRF, and a database
# entirely, which also keeps Cloud Run cold starts short.
INSTALLED_APPS = [
    "rest_framework",
    "corsheaders",
    "apps.core",
    "apps.example",
    "apps.fantasy_analysis",
    "apps.contact",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    # Cloud Run does not compress responses, and ETags let repeat requests 304.
    "django.middleware.gzip.GZipMiddleware",
    "django.middleware.http.ConditionalGetMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "api.urls"
WSGI_APPLICATION = "api.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "APP_DIRS": True,
    },
]

# No database: project data comes from GCS and other sources. When a project
# needs one, add DATABASES = {"default": env.db()} and set DATABASE_URL.
DATABASES = {}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "UNAUTHENTICATED_USER": None,
    # With no authentication, this lets GET/HEAD/OPTIONS through and refuses
    # writes, even on a view that happens to define post/put/delete. The
    # contact view is the one exception, and it opts out explicitly.
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticatedOrReadOnly"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    # Per visitor, for the views that throttle (only contact does).
    "DEFAULT_THROTTLE_RATES": {"contact": env.str("CONTACT_RATE", default="5/hour")},
}

# The site. www and the old github.io address both redirect here, so this is
# the only origin a browser ever sends.
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=["https://jacob-simerly.com"])

# How long parsed GCS blobs stay in each instance's in-memory cache.
GCS_CACHE_SECONDS = env.int("GCS_CACHE_SECONDS", default=300)

# Serve GCS reads from this local folder instead (<root>/<bucket>/<path>).
# Empty means real GCS. The E2E settings point it at api/e2e/gcs/.
GCS_LOCAL_ROOT = env.str("GCS_LOCAL_ROOT", default="")

# Leads from the site's "Work with me" form: each one is stored in this bucket
# (the API can only add to it) and emailed to LEADS_NOTIFY_TO.
LEADS_BUCKET = env.str("LEADS_BUCKET", default="jacobsimerly-site-leads")
LEADS_NOTIFY_TO = env.list("LEADS_NOTIFY_TO", default=[])
# One mailer. Locally it prints to the console; prod sends from my own email
# account (settings/prod.py), and tests swap in Django's in-memory outbox.
MAILERS = {"default": {"BACKEND": "django.core.mail.backends.console.EmailBackend"}}
DEFAULT_FROM_EMAIL = "jacob-simerly.com <webmaster@localhost>"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "America/New_York"
USE_I18N = False
USE_TZ = True

STATIC_URL = "static/"
