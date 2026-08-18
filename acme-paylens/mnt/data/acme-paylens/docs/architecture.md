# Architecture

```text
React/Vite UI -> REST/JSON -> Spring Boot modular monolith -> PostgreSQL
```

The system is intentionally a modular monolith. At 10,000 employees, PostgreSQL with indexed queries and server-side pagination is sufficient. Microservices, Kafka, Redis, Elasticsearch and Kubernetes would add operational cost without addressing a demonstrated scaling need.

## Modules
- `employee`: CRUD, search, filtering and pagination.
- `analytics`: database-backed aggregate reporting.
- `common`: validation/error handling.
- `config`: CORS and deterministic data seeding.

## Money
`BigDecimal` is used for salary values. The original local compensation is retained along with a normalized USD value for comparisons. Seeded FX conversion factors are intentionally static; live FX is out of scope.
