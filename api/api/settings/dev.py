from .base import *  # noqa: F403

DEBUG = True
SECRET_KEY = "dev-only-not-a-secret"
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# The browsable API is handy locally; prod serves JSON only.
INSTALLED_APPS = [*INSTALLED_APPS, "django.contrib.staticfiles"]  # noqa: F405
REST_FRAMEWORK = {
    **REST_FRAMEWORK,  # noqa: F405
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}

# `npm run dev` goes through Vite's proxy and needs no CORS, but
# `npm run preview` and direct calls from the browser do.
CORS_ALLOWED_ORIGINS = [
    *CORS_ALLOWED_ORIGINS,  # noqa: F405
    "http://localhost:5173",
    "http://localhost:4173",
]
