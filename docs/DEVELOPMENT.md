# How to Develop & Deploy the UFest Volunteer Web App

> This is the up-to-date version of the old "How to Develop in the UFest Volunteer
> Web App" guide. The stack has changed: the backend now uses **uv** (instead of
> Pipenv) on **Python 3.13**, and the frontend is a **Vite** app (instead of
> Create React App). The frontend and backend run as two independent dev servers,
> so you no longer need to build a production bundle just to do local work.

## Repo Setup

### Prerequisites

- **Python 3.13** (pinned in `.python-version`; `pyproject.toml` requires `>=3.13`)
- **[uv](https://docs.astral.sh/uv/)** — the Python project/package manager (replaces Pipenv)
- **Node.js 20** and **npm** (CI runs on Node 20)

> uv will download and manage the correct Python version for you, so you don't
> need a separate Python install if you use uv.

### Cloning and configuring

1. Clone the repo:

   ```bash
   git clone https://github.com/UFestYeg/UFestVolunteerSite.git
   cd UFestVolunteerSite
   ```

2. Create your environment file. Copy `.env.example` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   | Variable          | Description                                                        |
   | ----------------- | ------------------------------------------------------------------ |
   | `SECRET_KEY`      | Django secret key (any long random string).                        |
   | `EMAIL_ADDRESS`   | Gmail address used as the SMTP sender / `DEFAULT_FROM_EMAIL`.       |
   | `EMAIL_PASSWORD`  | App password for that Gmail account.                               |
   | `MINUTE_INTERVAL` | How often (in minutes) the email cron job runs. Defaults to 5.     |
   | `DEBUG`           | `"True"` for local dev, `"False"` for production.                  |

   Optional: `FRONTEND_URL` — base URL the admin uses to link back to the SPA.
   It defaults to `http://127.0.0.1:3000` in debug mode, so you normally don't
   need to set it locally.

3. Install dependencies:

   ```bash
   npm install          # frontend
   uv sync --dev        # backend (use `uv sync` without --dev for a prod-only install)
   ```

## Dev Usage

The backend (Django API + admin) and the frontend (Vite SPA) now run as two
separate processes during development.

### Backend (Django, port 8000)

```bash
uv run python manage.py migrate      # apply migrations
uv run python manage.py runserver    # http://127.0.0.1:8000
```

`uv run` executes inside the project's virtual environment, so you don't need to
manually activate one. (You can still open a long-lived shell with
`uv run bash` / `source .venv/bin/activate` if you prefer.)

### Frontend (Vite, port 3000)

```bash
npm start            # http://127.0.0.1:3000  (alias for `npm run dev`)
```

The SPA reads its API base URL from `import.meta.env.VITE_API_URI` and falls
back to `http://127.0.0.1:8000/` in dev, so it talks to your local Django server
out of the box — **no `.env.production` edit is required for local work**
(this replaces the old `REACT_APP_API_URI` workaround).

> **Use `127.0.0.1`, not `localhost`.** The Vite dev server binds to `127.0.0.1`
> on purpose. The browser treats `localhost` and `127.0.0.1` as different sites,
> which withholds the `SameSite=Lax` session cookie on cross-site requests and
> breaks frontend↔admin session sharing/logout in dev.

### Tests, type-checking, and linting

```bash
# Frontend
npm run typecheck    # tsc --noEmit
npm run test:run     # Vitest (one-shot); use `npm test` for watch mode
npm run lint         # ESLint
npm run format       # Prettier

# Backend
uv run python manage.py test -v 2
uv run python manage.py check
```

## Production Build

In production, Django serves the compiled SPA from the same origin, so static
files have to be built and collected.

1. Set the production API URL. `.env.production` should point `VITE_API_URI` at
   the live host (currently `https://www.volunteer.ufest.ca/`).

2. Build the frontend with Vite (output goes to `build/`):

   ```bash
   npm ci
   npm run build
   ```

3. Collect static files. WhiteNoise serves them via
   `CompressedManifestStaticFilesStorage`, and `STATIC_ROOT` is `build/staticfiles`:

   ```bash
   uv run python manage.py collectstatic --noinput
   ```

4. Apply migrations:

   ```bash
   uv run python manage.py migrate
   ```

## Deploying the Prod App

The repo ships a `Procfile`, so it deploys to any Procfile-based host
(Heroku / Render-style platforms):

```
release: python manage.py migrate
web: gunicorn backend.wsgi --log-file -
```

- The **release** phase runs migrations automatically on deploy.
- The **web** process serves the app with **gunicorn** (WhiteNoise serves static
  assets, so no separate static server is needed).

A typical update is:

1. Push/merge to the deployed branch (e.g. `master`). On Procfile platforms the
   build runs `npm ci && npm run build`, `uv sync`, `collectstatic`, and the
   `release` migration automatically.
2. Make sure the production environment variables (`SECRET_KEY`, `EMAIL_ADDRESS`,
   `EMAIL_PASSWORD`, `MINUTE_INTERVAL`, `DEBUG=False`, and `VITE_API_URI` for the
   build) are configured on the host.
3. After deploy, sanity-check the live site and review logs.

### If you deploy on a shell-based host (e.g. PythonAnywhere)

If you're updating the app manually over SSH rather than via a Procfile
platform, run the equivalent steps by hand in the project directory:

```bash
git pull
uv sync                                   # install backend deps
npm ci && npm run build                   # build the SPA into build/
uv run python manage.py collectstatic --noinput
uv run python manage.py migrate
```

Then reload the web app from the host's dashboard and confirm it's running.

### Scheduled emails (cron)

Reminder emails are sent by a cron job defined in `settings.py` (`CRONJOBS`,
via `django-crontab`) and queued/sent with `django-post-office` over Gmail SMTP:

- `volunteer_categories.cron.send_mail_job` — runs every `MINUTE_INTERVAL` minutes.
- `volunteer_categories.cron.delete_mail_job` — runs monthly to clean up sent mail.

On a shell-based host, (re)register the cron entries after deploying:

```bash
uv run python manage.py crontab add      # or `crontab show` / `crontab remove`
```

After deploying, check `send_mail.log` and the host's logs to confirm the cron
job is firing and emails are going out.

## License

[MIT](https://choosealicense.com/licenses/mit/)
