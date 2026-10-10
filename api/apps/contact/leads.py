"""A visitor's way to reach me: checked, stored, and sent to my inbox.

A lead is an email address or a phone number, nothing else. It's stored as
one JSON file per lead in a private bucket the API can only add to, then
emailed to me, so neither a storage hiccup nor a mail hiccup loses it alone.
"""

import re
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email

from apps.core.gcs import write_json

# Digits with the usual separators, and an optional leading +.
PHONE = re.compile(r"^\+?[\d\s().-]+$")
WHERE = {"hero": "the top of the home page", "footer": "the end of the home page"}
EASTERN = ZoneInfo("America/New_York")


def classify(text):
    """('email', address) or ('phone', number), or None for anything else.
    A phone keeps its leading + and loses its separators."""
    text = text.strip()
    try:
        validate_email(text)
        return "email", text
    except ValidationError:
        pass
    if PHONE.match(text):
        digits = re.sub(r"\D", "", text)
        if 10 <= len(digits) <= 15:
            return "phone", ("+" if text.startswith("+") else "") + digits
    return None


def make(kind, contact, source, now):
    return {"received": now.isoformat(timespec="seconds"), "kind": kind, "contact": contact, "source": source}


def store(lead, now):
    name = f"leads/{now:%Y/%m/%d}/{now:%H%M%S}-{uuid.uuid4().hex[:8]}.json"
    write_json(settings.LEADS_BUCKET, name, lead)


def notify(lead, now):
    kind, contact = lead["kind"], lead["contact"]
    reply = f"Reply: mailto:{contact}" if kind == "email" else f"Call or text: tel:{contact}"
    body = "\n".join(
        [
            "Someone wants to work with you.",
            "",
            f"{kind.capitalize()}: {contact}",
            f"From: {WHERE.get(lead['source'], 'the site')}",
            f"At: {now.astimezone(EASTERN):%b %d, %Y at %I:%M %p} Eastern",
            "",
            reply,
        ]
    )
    send_mail(f"New lead from jacob-simerly.com: {contact}", body, settings.DEFAULT_FROM_EMAIL, settings.LEADS_NOTIFY_TO)


def now():
    return datetime.now(EASTERN)
