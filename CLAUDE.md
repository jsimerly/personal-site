# personal-site

Static React site (`frontend/`, GitHub Pages at jacob-simerly.com) reading a public, read-only DRF API (`api/`, Cloud Run). The frontend is mobile-first: desktop comes from responsive prefixes, never at mobile's expense.

## Commands

API, from `api/` (venv at `api/.venv`):

```sh
pytest                                # unit suite
pytest --cov                          # plus the coverage floor CI enforces (.coveragerc)
python scripts/build_test_catalog.py  # regenerate api/TESTING.md
python manage.py runserver            # dev server on :8000
```

Frontend, from `frontend/`:

```sh
npm test                 # unit suite; npm run test:coverage adds the thresholds CI enforces
npm run lint
npm run e2e              # e2e:headed / e2e:ui to watch; Playwright boots both servers itself
npm run test:catalog     # regenerate frontend/TESTING.md
npm run dev              # :5173, proxies /api to :8000
```

Check exit codes. Never pipe a test run through tail or grep and treat the result as green.

## Git

`main` is protected. Every change lands through a PR, and the **API**, **Frontend**, and **E2E** checks must pass on a branch that is up to date with `main`. Merging a frontend change deploys the site; the API deploys manually.

## Testing

Three lanes, all required in CI:

- **API (pytest).** Every test has a one-line docstring stating the behavior it protects; collection fails without one. The docstrings are the catalog in `api/TESTING.md`. Tests go in the app's `tests/` folder, in a file named for their subject.
- **Frontend unit (Vitest + Testing Library).** `describe`/`it` names are full sentences; they are the catalog in `frontend/TESTING.md`. Stub the network with `src/test/fakeFetch.js` rather than mocking the modules under test.
- **E2E (Playwright).** Real Chromium, on a phone and a laptop, against the production build served at the site root and calling a real Django (`api.settings.e2e`) cross-origin, exactly as on jacob-simerly.com. No API mocks: specs may only delay or cut the network (`e2e/helpers.js`). Import `test` from `e2e/fixtures.js`, which fails any test whose page logs an error. Navigate with `visit()`. GCS reads come from `api/e2e/gcs/<bucket>/<path>`, so a project that reads GCS adds its fixture files there.

Rules:

- Assert exact values, not existence.
- A test guarding a fix is proven before it counts: revert the fix, watch the test fail, restore.
- When a test fails, work out the correct rule first, then make the code and the test match it. Never adjust a test just to go green.
- Bugs become test classes: pin the regression where it happened, name the class of failure, sweep all three lanes for siblings, and pin at the most general layer.
- Flakes get investigated (traces are kept on failure), never retried away. `retries: 0` is deliberate.
- Coverage floors only go up.
- Regenerate and commit both catalogs with new tests. CI fails when either is stale.

Workflow: per change, run the relevant tests, scoped generously (touched files plus their neighbors), not whole suites. Run all three lanes in full locally before pushing a PR for merge; CI is the second layer, not the first place a failure shows up.
