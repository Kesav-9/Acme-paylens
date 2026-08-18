# AI-assisted development log

AI was used as an accelerator for requirements decomposition, architecture review, API/test edge cases, UI scaffolding and documentation. Engineering decisions were explicitly reviewed rather than accepted blindly.

Examples of useful prompts:
- Review this salary-management problem and identify the minimum useful HR workflows.
- Challenge a Spring Boot + React modular-monolith architecture for a 10,000-record compensation system.
- Identify correctness risks around monetary values, pagination, filters and aggregation.
- Generate deterministic edge cases for employee compensation validation.
- Review whether proposed infrastructure is justified by the stated scale.

Human decisions retained: PostgreSQL over NoSQL, REST over GraphQL, modular monolith over microservices, BigDecimal over floating point, deterministic seeded FX data over a live external service, and database aggregation over loading all employees into application memory.
