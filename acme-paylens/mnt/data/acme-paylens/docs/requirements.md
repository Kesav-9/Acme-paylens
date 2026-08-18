# ACME PayLens — One-page Requirements

## Goal
Replace spreadsheet-based salary management for ~10,000 employees with a web application that lets HR manage compensation and understand how the organization pays people.

## Primary user
HR Manager.

## In scope
- Paginated employee directory with search and department/country filtering.
- Add and edit employee compensation.
- Local salary/currency plus normalized USD salary for cross-country comparisons.
- Dashboard: employee count, total payroll, average/min/max salary.
- Department and country compensation analytics.
- Validation and clear API errors.
- Deterministic seed of 10,000 employees.

## Scale / quality
- Server-side pagination and indexed filtering.
- Database-side aggregation.
- BigDecimal for monetary values.
- Fast deterministic unit tests.

## Deliberately out of scope
Payroll execution, taxes, benefits, SSO/RBAC, compensation history, real-time FX rates, employee self-service, and LLM-generated SQL. These are valuable production capabilities but do not validate the assessment's core salary-management problem and would add complexity disproportionate to a 10,000-employee dataset.

## Success criteria
An HR Manager can find an employee, inspect/update salary data, and answer organization-level compensation questions without using spreadsheets.
