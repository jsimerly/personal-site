from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Local overrides live in api/.env (gitignored). On Cloud Run the same names are
# plain environment variables, so a missing file is fine.
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

# The API is public and read-only: nobody logs in and nothing is written. That
# lets it skip django.contrib.auth, sessions, CSRF, and a database entirely,
# which also keeps Cloud Run cold starts short.
INSTALLED_APPS = [
    "rest_framework",
    "corsheaders",
    "apps.core",
    "apps.example",
    "apps.fantasy_analysis",
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
    # writes, even on a view that happens to define post/put/delete.
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticatedOrReadOnly"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
}

# The site. www and the old github.io address both redirect here, so this is
# the only origin a browser ever sends.
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=["https://jacob-simerly.com"])

# How long parsed GCS blobs stay in each instance's in-memory cache.
GCS_CACHE_SECONDS = env.int("GCS_CACHE_SECONDS", default=300)

# Serve GCS reads from this local folder instead (<root>/<bucket>/<path>).
# Empty means real GCS. The E2E settings point it at api/e2e/gcs/.
GCS_LOCAL_ROOT = env.str("GCS_LOCAL_ROOT", default="")

LANGUAGE_CODE = "en-us"
TIME_ZONE = "America/New_York"
USE_I18N = False
USE_TZ = True

STATIC_URL = "static/"
