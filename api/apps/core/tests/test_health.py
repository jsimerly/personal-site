def test_health_returns_ok(api_client):
    """The health check the frontend pings on every page load answers 200 with status ok."""
    response = api_client.get("/api/health/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
