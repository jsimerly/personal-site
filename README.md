# Jacob Simerly

The source for my personal website: one home for the projects I build.

**Live at [jsimerly.github.io/personal-site](https://jsimerly.github.io/personal-site/)**

## Projects

Each project gets its own page on the site, backed by the data behind it. Projects are being added now.

## How it works

```
Browser ──> GitHub Pages          static React app, loads instantly
   │
   └── GET /api/... ──> Cloud Run          Django REST Framework, read-only
                           │
                           └──> Google Cloud Storage and other data sources
```

The site is split in two on purpose. The frontend is a static React app on GitHub Pages, so it's always fast. The data comes from a small read-only API on Cloud Run, which scales to zero when nobody is using it.

Scaling to zero means the API can take a few seconds to wake up, so the site is built around that:

- The home page and project list are static and never wait on the API.
- Every page quietly pings the API as it loads, so it's usually awake by the time you open a project.
- If a request is still slow, the page says the server is waking up instead of just spinning.

## Built with

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **API:** Django REST Framework on Google Cloud Run
- **Data:** Google Cloud Storage
- **CI/CD:** GitHub Actions, deploying to GitHub Pages

The frontend lives in [`frontend/`](frontend/) and the API in [`api/`](api/).
