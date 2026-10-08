def test_summarizes_how_the_model_is_validated(api_client, published):
    """The model view carries the backtest metrics, rounded, and nothing else from the performance section."""
    response = api_client.get("/api/fantasy-analysis/model/")

    assert response.status_code == 200
    assert response.json() == {
        "run_date": "2026-10-07",
        "career_backend": "tabpfn(model_version=v2)",
        "spearman_vs_market": 0.9314,
        "career": {
            "start_season": 2010,
            "mae": [
                {
                    "horizon": 1,
                    "model": 34.2032,
                    "decay": 36.0938,
                    "carry_forward": 38.2966,
                    "model_%_vs_carry": 10.7,
                    "model_%_vs_decay": 5.2,
                    "n_total": 8502,
                    "folds": 15,
                }
            ],
        },
        "value": {
            "horizon": 3,
            "first_cohort": 2020,
            "discount_rate": 0.2,
            "mean": {
                "spearman_iv_vs_realized": 0.6687,
                "spearman_ktc_vs_realized": 0.6638,
                "spearman_blend_vs_realized": 0.6844,
                "spearman_iv_vs_ktc": 0.8942,
            },
            "bootstrap": {"iv_minus_ktc": 0.0052, "ci90_lo": -0.0678, "ci90_hi": 0.0758},
            "per_cohort": [
                {
                    "cohort_T": 2020,
                    "n_players": 91,
                    "spearman_iv_vs_realized": 0.6866,
                    "spearman_ktc_vs_realized": 0.7089,
                    "spearman_blend_vs_realized": 0.7169,
                }
            ],
            "terciles": [{"tercile": "market cheap vs IV", "n": 124, "mean_beat_market_by": 13.451}],
        },
        "inseason": {
            "cohorts": "2021-2024",
            "ros": [
                {"W": 3, "n": 681, "ros|model": 0.7836, "ros|ktc": 0.7044, "ros|last_season": 0.6, "ros|to_date": 0.7004, "ros|blend": 0.7564}
            ],
        },
        "market": {
            "cohorts": "2020-2024",
            "overall": [
                {
                    "variant": "xgb",
                    "horizon": 3,
                    "n": 366,
                    "rho_model": 0.6854,
                    "rho_ktc": 0.6776,
                    "edge_corr": 0.3194,
                    "cheap_gap_real": 11.8595,
                    "rich_gap_real": -9.4504,
                }
            ],
            "by_position": [
                {
                    "variant": "xgb",
                    "horizon": 3,
                    "n": 82,
                    "rho_model": 0.6199,
                    "rho_ktc": 0.6651,
                    "edge_corr": 0.2824,
                    "cheap_gap_real": 10.1765,
                    "rich_gap_real": -3.2,
                    "position": "QB",
                }
            ],
        },
        "experiments": [
            {
                "name": "tabpfn35_set_stacked_w",
                "n_features": 73,
                "horizon": 3,
                "cohorts": "2015-2022",
                "spearman_war_all": 0.6051,
                "mae_war_top": 0.4742,
                "spearman_iv_vs_realized": 0.6939,
                "spearman_ktc_vs_realized": 0.6641,
                "edge_corr": 0.3663,
            }
        ],
    }
