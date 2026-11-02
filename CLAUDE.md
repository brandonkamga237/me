# me

Portfolio of Brandon Kamga (brandonkamga.com), in English and French, with an admin back office.
Monorepo: `frontend/` (Next.js 16, pnpm), `backend/` (FastAPI, MongoDB, uv), `infra/` (Compose,
behind Traefik in production). The README explains how the pieces connect and how to run them.

## Commands

| Where | Command |
| --- | --- |
| root | `docker compose -f infra/docker-compose.yml up -d` (MongoDB) |
| `backend/` | `uv run uvicorn app.main:create_app --factory --reload`, `uv run python -m app.seed` |
| `backend/` | `uv run pytest`, `uv run ruff check .`, `uv run ruff format .`, `uv run mypy app tests` |
| `frontend/` | `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm build` |

Use `pnpm`, never `npm`. Before a commit, the checks of the area you touched must pass.

## Rules

- Code, identifiers, commits and comments are in English. French is for what people read: the
  admin UI and the French dictionary
- Comments explain why, never what
- Keep the monochrome palette (tokens in `frontend/src/app/globals.css`); brand logos are the
  only colour
- Commits: `type(scope): description`, small and atomic, backend, frontend and infra never mixed

## Backend

- One package per module under `app/`: `domain.py` (dataclasses + store `Protocol`),
  `application.py` (use cases), `infra.py` (MongoDB adapter), `api.py` (routes and schemas)
- `domain` and `application` import no framework: `tests/test_architecture.py` enforces it
- Routes parse, call one service method and return `XxxResponse.of(...)`; request bodies convert
  themselves (`to_domain()`, `to_draft()`). Never return a domain object
- Errors are raised as `NotFoundError`, `ConflictError`, `UnauthenticatedError`,
  `TooManyRequestsError`; `app/shared/http.py` maps them to a status
- Admin routes live on the module's `admin` router, which depends on `require_admin`
- Application and API tests use the copying fakes in `tests/fakes.py`; adapter tests are
  `@pytest.mark.integration` and run against MongoDB through Testcontainers
- A new setting goes into `app/config.py`, `infra/.env.example` and
  `infra/docker-compose.prod.yml` together; a secret never has a production default

## Frontend

- Read `frontend/AGENTS.md`: Next.js 16 differs from older versions (`proxy.ts`, Cache
  Components, `updateTag`). Its docs are in `frontend/node_modules/next/dist/docs/`
- Every API call goes through `src/services/`: `api.ts` (public, cached and tagged),
  `adminApi.ts` (admin, with the session token), `http.ts` (the only fetch wrapper)
- Public reads are `use cache` functions with a tag from `contentTags`; an admin action that
  changes content calls `updateTag` with the same tag
- Request data (`cookies()`, `params` beyond the static ones, uncached fetches) sits behind a
  `<Suspense>` boundary, or the build fails
- Site text comes from `src/lib/dictionaries/{en,fr}.json`; both files have the same keys
- Import through `@/`, type props with `interface XxxProps`, Tailwind only

## Never

- Expose the API publicly or call it from the browser
- Commit `.env`, a real password hash or a JWT secret
- Use `latest` for an image in `infra/docker-compose.prod.yml`
