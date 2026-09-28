FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=api.settings.prod

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Google's recommended shape for Cloud Run: one worker per vCPU, threads for
# concurrency (requests mostly wait on GCS), and no gunicorn timeout because
# Cloud Run enforces its own request timeout.
CMD exec gunicorn api.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --worker-class gthread \
    --workers 1 \
    --threads 8 \
    --timeout 0
