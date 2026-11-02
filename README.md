# me

The source of [brandonkamga.com](https://brandonkamga.com): my portfolio in English and French,
and the back office I edit it from.

| | |
| --- | --- |
| [`frontend/`](frontend/) | Public site and admin: Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, pnpm |
| [`backend/`](backend/) | REST API: FastAPI, Python 3.12+, MongoDB (PyMongo async), uv |
| [`infra/`](infra/) | Docker Compose for development and production (behind Traefik), MongoDB init and backups |

## How it fits together

```
browser ──https──▶ Traefik ──▶ Next.js ──private network──▶ FastAPI ──▶ MongoDB
```

- Only the web app is reachable, through Traefik. The browser never calls the API: pages and server actions in Next.js
  do, from the server, so there is no CORS and no token in the browser.
- Public pages are prerendered and cached (`use cache` + `cacheTag`). Saving in the admin
  expires the matching tag, so the site shows the change on the next request.
- The admin signs in with credentials from configuration (one account, Argon2 hash). The API
  issues a short-lived JWT that Next.js keeps in an `httpOnly`, `SameSite=Strict` cookie
  scoped to `/admin`.
- The backend follows a hexagonal layout per module (`profile`, `projects`, `experiences`,
  `skills`, `messages`, `auth`): `domain` and `application` are plain Python, `infra` holds the
  MongoDB adapters, `api` the routes. A test keeps frameworks out of the core.

## Run it locally

Requirements: Docker, Python 3.12+ with [uv](https://docs.astral.sh/uv/), Node 22 and pnpm.
No configuration file is needed.

1. Start MongoDB:

   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```

2. Start the API and load the starting content:

   ```bash
   cd backend
   uv sync
   uv run python -m app.seed
   uv run uvicorn app.main:create_app --factory --reload
   ```

   API docs: http://localhost:8000/api/docs

3. In a second terminal, start the site:

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

4. Open http://localhost:3000. The admin is at http://localhost:3000/admin
   (`admin@example.com` / `admin-dev-password` in development).

Or everything in containers: `docker compose -f infra/docker-compose.yml --profile app up -d --build`.

## Checks

| Where | Command | What |
| --- | --- | --- |
| `backend/` | `uv run pytest` | API and application tests on in-memory stores, no Docker |
| `backend/` | `uv run pytest -m integration` | MongoDB adapters against a real server (Testcontainers, Docker) |
| `backend/` | `uv run ruff check . && uv run ruff format --check . && uv run mypy app tests` | Lint, format, strict types |
| `frontend/` | `pnpm typecheck && pnpm lint && pnpm build` | Types, lint, production build |

CI runs all of them on every pull request.

## Deploy

The site runs on the VPS that hosts the other projects, behind its Traefik (network
`traefik-public`, Let's Encrypt resolver `le`), which issues the HTTPS certificate.

1. The DNS `A` records of `brandonkamga.com` and `www.brandonkamga.com` point at the VPS.
2. Once, on the server: create `DEPLOY_PATH/.env` from [`infra/.env.example`](infra/.env.example)
   (`chmod 600`). The application secrets live only there.
3. Repository secrets, shared with the other projects: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`,
   and `DEPLOY_PATH` (`/root/me`).
4. Tag a release:

   ```bash
   git tag v0.1.0 && git push origin v0.1.0
   ```

   [`release.yml`](.github/workflows/release.yml) publishes both images to GitHub Container
   Registry, then [`deploy.yml`](.github/workflows/deploy.yml) uploads the compose file to the
   server, pulls that version and waits until every service is healthy. To redeploy or roll
   back, run *Deploy* from the Actions tab with an earlier tag.
5. After the first deploy, load the starting content once:

   ```bash
   docker compose -f docker-compose.prod.yml exec api python -m app.seed
   ```

6. Schedule `scripts/backup.sh` daily (cron) and copy `backups/` off the server.

The API refuses to start in production with a development secret, admin hash or email.
