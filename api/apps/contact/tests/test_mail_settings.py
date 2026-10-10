import importlib

import pytest
from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend

# Django's SMTP backend checks every address before it connects. The test and
# E2E outboxes don't, so an address it would refuse only fails in prod, where
# a lead's alert is lost. These run the real addresses through that check.
smtp = EmailBackend(alias="address-check", host="localhost", port=25)


@pytest.fixture
def prod(monkeypatch):
    """The prod settings module, loaded the way Cloud Run loads it."""
    env = {
        "SECRET_KEY": "test-only",
        "ALLOWED_HOSTS": "api.example",
        "LEADS_EMAIL": "jacob@example.com",
        "EMAIL_APP_PASSWORD": "not-a-password",
    }
    for name, value in env.items():
        monkeypatch.setenv(name, value)
    import api.settings.prod as module

    return importlib.reload(module)


def test_prod_sends_alerts_from_my_own_email_through_gmail(prod):
    """Prod signs in to my own Gmail account over TLS and sends each lead from that address to itself."""
    assert prod.MAILERS["default"] == {
        "BACKEND": "django.core.mail.backends.smtp.EmailBackend",
        "OPTIONS": {
            "host": "smtp.gmail.com",
            "port": 587,
            "use_tls": True,
            "username": "jacob@example.com",
            "password": "not-a-password",
            "timeout": 10,
        },
    }
    assert prod.LEADS_NOTIFY_TO == ["jacob@example.com"]


def test_prods_sender_and_inbox_pass_the_smtp_backends_address_check(prod):
    """Prod's sender and inbox are addresses the SMTP backend accepts, so an alert never fails before it is sent."""
    assert smtp.prep_address(prod.DEFAULT_FROM_EMAIL) == "jacob@example.com"
    assert [smtp.prep_address(address) for address in prod.LEADS_NOTIFY_TO] == ["jacob@example.com"]


def test_the_default_sender_passes_the_smtp_backends_address_check():
    """The sender every other environment uses is one the SMTP backend accepts too."""
    assert smtp.prep_address(settings.DEFAULT_FROM_EMAIL) == "webmaster@localhost"
