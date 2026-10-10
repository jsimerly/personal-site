import logging

from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from . import leads

log = logging.getLogger(__name__)
THANKS = {"ok": True}


class ContactThrottle(AnonRateThrottle):
    """A few tries an hour per visitor: plenty for a person, little for a script."""

    scope = "contact"


class LeadForm(serializers.Serializer):
    contact = serializers.CharField(max_length=254)
    source = serializers.ChoiceField(["hero", "footer"], required=False, default="hero")
    # A decoy no person sees or fills in (the site hides it); bots fill in
    # every field they find.
    website = serializers.CharField(required=False, allow_blank=True, max_length=254)


# The one place the API takes a write: the read-only default is lifted for
# this view alone, and it's throttled.
@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([ContactThrottle])
def contact(request):
    form = LeadForm(data=request.data)
    form.is_valid(raise_exception=True)
    if form.validated_data.get("website"):
        # A bot: thank it like anyone else, so it learns nothing, and drop it.
        return Response(THANKS, status=202)

    found = leads.classify(form.validated_data["contact"])
    if found is None:
        raise ValidationError({"contact": ["Enter an email address or a phone number."]})

    now = leads.now()
    lead = leads.make(*found, form.validated_data["source"], now)
    stored = sent = False
    try:
        leads.store(lead, now)
        stored = True
    except Exception:
        log.exception("Couldn't store a lead")
    try:
        leads.notify(lead, now)
        sent = True
    except Exception:
        log.exception("Couldn't email a lead")

    # Either one is enough to not lose it; only both failing is a failure.
    if not (stored or sent):
        return Response({"detail": "Couldn't take that right now. Try again in a moment."}, status=503)
    return Response(THANKS, status=202)
