import pytest
from django.core import mail

from apps.contact import leads

URL = "/api/contact/"
PATH = "leads/2026/10/10/140309-12345678.json"


def post(api_client, **data):
    return api_client.post(URL, data, format="json")


def test_takes_an_email_stores_it_and_emails_me(api_client, frozen, stored):
    """An email address is stored as one record in the leads bucket and emailed to me, ready to reply to."""
    response = post(api_client, contact="  Jane.Doe@Example.com ", source="hero")

    assert response.status_code == 202
    assert response.json() == {"ok": True}
    assert stored() == {
        PATH: {"received": "2026-10-10T14:03:09-04:00", "kind": "email", "contact": "Jane.Doe@Example.com", "source": "hero"}
    }
    [message] = mail.outbox
    assert message.subject == "New lead from jacob-simerly.com: Jane.Doe@Example.com"
    assert message.to == ["jacob@test.invalid"]
    assert message.from_email == "jacob-simerly.com <webmaster@localhost>"
    assert message.body == (
        "Someone wants to work with you.\n"
        "\n"
        "Email: Jane.Doe@Example.com\n"
        "From: the top of the home page\n"
        "At: Oct 10, 2026 at 02:03 PM Eastern\n"
        "\n"
        "Reply: mailto:Jane.Doe@Example.com"
    )


@pytest.mark.parametrize(
    ("typed", "kept"),
    [
        ("(317) 555-0142", "3175550142"),
        ("317.555.0142", "3175550142"),
        ("+1 317 555 0142", "+13175550142"),
        ("+44 20 7946 0958", "+442079460958"),
    ],
)
def test_takes_a_phone_number_in_any_common_format(api_client, frozen, stored, typed, kept):
    """A phone number is kept as its digits (and any leading +), however it was typed, and emailed as one to call or text."""
    response = post(api_client, contact=typed, source="footer")

    assert response.status_code == 202
    assert stored()[PATH]["kind"] == "phone"
    assert stored()[PATH]["contact"] == kept
    [message] = mail.outbox
    assert f"Phone: {kept}\nFrom: the end of the home page\n" in message.body
    assert message.body.endswith(f"Call or text: tel:{kept}")


@pytest.mark.parametrize("typed", ["jane", "jane@", "@example.com", "555-0142", "1234567890123456", "call me maybe"])
def test_refuses_anything_that_is_neither_an_email_nor_a_phone_number(api_client, stored, typed):
    """Text that isn't an email address or a 10 to 15 digit phone number is refused with a plain message, and nothing is kept or sent."""
    response = post(api_client, contact=typed)

    assert response.status_code == 400
    assert response.json() == {"contact": ["Enter an email address or a phone number."]}
    assert stored() == {}
    assert mail.outbox == []


def test_refuses_an_empty_or_overlong_entry(api_client, stored):
    """Nothing at all, or more than an email address could be, is refused before anything else happens."""
    assert post(api_client, contact="").json() == {"contact": ["This field may not be blank."]}
    assert post(api_client, contact="a" * 246 + "@test.com").json() == {
        "contact": ["Ensure this field has no more than 254 characters."]
    }
    assert stored() == {}


def test_a_bot_that_fills_in_the_decoy_is_thanked_and_dropped(api_client, stored):
    """A submission with the hidden decoy filled in looks accepted, so the bot learns nothing, but is neither kept nor sent."""
    response = post(api_client, contact="bot@spam.example", website="https://spam.example")

    assert response.status_code == 202
    assert response.json() == {"ok": True}
    assert stored() == {}
    assert mail.outbox == []


def test_lets_one_visitor_try_five_times_an_hour(api_client, gcs_root):
    """After five tries in an hour, a visitor is told to wait, whether the tries were valid or not."""
    statuses = [post(api_client, contact=f"person{i}@example.com" if i % 2 else "nope").status_code for i in range(6)]

    assert statuses == [400, 202, 400, 202, 400, 429]


def test_still_emails_me_when_the_lead_cannot_be_stored(api_client, monkeypatch, frozen, stored):
    """If storage fails, the email alone keeps the lead, so the visitor is still thanked."""
    monkeypatch.setattr(leads, "store", lambda lead, now: (_ for _ in ()).throw(OSError("bucket down")))

    response = post(api_client, contact="jane@example.com")

    assert response.status_code == 202
    assert [message.subject for message in mail.outbox] == ["New lead from jacob-simerly.com: jane@example.com"]


def test_still_stores_the_lead_when_the_email_cannot_be_sent(api_client, monkeypatch, frozen, stored):
    """If the email fails, the stored record alone keeps the lead, so the visitor is still thanked."""
    monkeypatch.setattr(leads, "notify", lambda lead, now: (_ for _ in ()).throw(OSError("mail down")))

    response = post(api_client, contact="jane@example.com")

    assert response.status_code == 202
    assert list(stored()) == [PATH]


def test_says_to_try_again_only_when_it_can_neither_store_nor_send(api_client, monkeypatch, stored):
    """Only when both storing and emailing fail is the visitor told it didn't go through."""
    monkeypatch.setattr(leads, "store", lambda lead, now: (_ for _ in ()).throw(OSError("bucket down")))
    monkeypatch.setattr(leads, "notify", lambda lead, now: (_ for _ in ()).throw(OSError("mail down")))

    response = post(api_client, contact="jane@example.com")

    assert response.status_code == 503
    assert response.json() == {"detail": "Couldn't take that right now. Try again in a moment."}


def test_only_takes_submissions(api_client):
    """The contact endpoint has nothing to read: a GET is refused."""
    assert api_client.get(URL).status_code == 405


def test_the_site_may_submit_cross_origin(api_client):
    """The site's origin passes the browser's preflight for a JSON POST; others get no CORS header."""
    preflight = {"HTTP_ACCESS_CONTROL_REQUEST_METHOD": "POST", "HTTP_ACCESS_CONTROL_REQUEST_HEADERS": "content-type"}

    site = api_client.options(URL, HTTP_ORIGIN="https://jacob-simerly.com", **preflight)
    other = api_client.options(URL, HTTP_ORIGIN="https://somewhere-else.example", **preflight)

    assert site.status_code == 200
    assert site["Access-Control-Allow-Origin"] == "https://jacob-simerly.com"
    assert "POST" in site["Access-Control-Allow-Methods"]
    assert "Access-Control-Allow-Origin" not in other
