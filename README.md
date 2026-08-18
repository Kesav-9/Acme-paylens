# ACME PayLens

Full-stack employee salary management and compensation analytics for a 10,000-person organization.

## Stack
- Java 21 + Spring Boot 4
- Spring Data JPA + Bean Validation
- PostgreSQL (Docker) / H2 fallback for local backend-only development
- React 19 + Vite 8 + Recharts
- Docker Compose
- JUnit / Mockito

## Fastest way to run
Requires Docker Desktop.

```bash
docker compose up --build
```

Open **http://localhost:3000**. The API is exposed at **http://localhost:8080/api** and health at **http://localhost:8080/actuator/health**.

On first startup the backend deterministically seeds exactly **10,000 employees**. The PostgreSQL volume keeps the data on later restarts.

To reset and reseed:

```bash
docker compose down -v
docker compose up --build
```

## Run without Docker
Backend requires Java 21 + Maven:

```bash
cd backend
mvn spring-boot:run
```

With no DB environment variables it uses a local H2 database file.

Frontend requires Node 22+:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## Core APIs
- `GET /api/employees?page=0&size=25`
- `GET /api/employees?search=ACME-00042`
- `GET /api/employees?department=Engineering&country=USA`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`
- `GET /api/analytics/summary`
- `GET /api/analytics/departments`
- `GET /api/analytics/countries`

## Tests
```bash
cd backend
mvn test
```

The Docker backend image also runs tests during image build.

## Assessment artifacts
See `docs/requirements.md`, `docs/architecture.md`, and `docs/ai-development-log.md`.

## Suggested incremental commits
1. `docs: define product requirements and deliberate exclusions`
2. `docs: document architecture and scaling tradeoffs`
3. `feat: add employee domain and CRUD API`
4. `feat: add pagination search and filters`
5. `feat: add deterministic 10k employee seed`
6. `feat: add compensation analytics`
7. `test: cover employee service core behavior`
8. `feat: add React employee management UI`
9. `feat: add compensation dashboard`
10. `chore: add Docker Compose production-like runtime`
11. `docs: document AI-assisted engineering workflow`
