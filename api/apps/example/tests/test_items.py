def test_items_lists_every_item(api_client):
    """The example endpoint returns every item, in order, as a JSON list."""
    response = api_client.get("/api/example/items/")

    assert response.status_code == 200
    assert [item["name"] for item in response.json()] == ["First item", "Second item", "Third item"]
