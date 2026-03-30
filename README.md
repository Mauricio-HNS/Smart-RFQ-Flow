# Smart RFQ Flow

<p align="center">
  <img src="https://img.shields.io/badge/ASP.NET%20Core-9-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="ASP.NET Core" />
  <img src="https://img.shields.io/badge/React-TypeScript-0f172a?style=for-the-badge&logo=react&logoColor=61dafb" alt="React TypeScript" />
  <img src="https://img.shields.io/badge/Architecture-Modular%20Monolith-153b52?style=for-the-badge" alt="Modular Monolith" />
  <img src="https://img.shields.io/badge/Domain-RFQ%20to%20Offer-5b2333?style=for-the-badge" alt="RFQ to Offer" />
</p>

Smart RFQ Flow is a mini-enterprise platform that simulates the full RFQ-to-Offer lifecycle: customer onboarding, RFQ creation, pricing orchestration, approval workflow, offer generation, auditability, analytics and a sourcing-oriented catalog experience.

## Why this repository is strong for portfolio reviews

- clear modular monolith structure with room to evolve into microservices
- realistic enterprise workflow instead of isolated CRUD screens
- backend-driven catalog search, filters and pagination
- audit and integration logs for traceability
- React frontend with a polished business-facing interface
- clean expansion path for PostgreSQL, JWT, RabbitMQ and Playwright

## Current scope

- RFQ lifecycle from draft to sent offer
- customer and product management
- approval desk and offer center
- analytics overview and processing metrics
- fake Salesforce and SAP integrations
- industrial catalog explorer
- sourcing console with batch-import simulation

## Architecture

```text
frontend (React + TypeScript)
    ->
backend API (ASP.NET Core)
    ->
application layer
    ->
domain layer
    ->
in-memory infrastructure today
```

Projects:

- `backend/src/SmartRfqFlow.Api`
- `backend/src/SmartRfqFlow.Application`
- `backend/src/SmartRfqFlow.Domain`
- `backend/src/SmartRfqFlow.Infrastructure`
- `backend/src/SmartRfqFlow.Worker`
- `backend/tests/SmartRfqFlow.Tests`
- `frontend`

## Key endpoints

- `GET /api/catalog/search`
- `GET /api/catalog/summary`
- `POST /api/catalog/import`
- `GET /api/rfqs`
- `POST /api/rfqs/{id}/approve`
- `POST /api/rfqs/{id}/generate-offer`
- `POST /api/offers/{id}/send`
- `GET /api/analytics/overview`
- `GET /api/integrations/logs`
- `GET /health`

Full technical notes:

- `docs/architecture.md`
- `docs/domain-workflow.md`
- `docs/api.md`

## Run locally

### API

```bash
dotnet run --project backend/src/SmartRfqFlow.Api/SmartRfqFlow.Api.csproj --urls http://localhost:5058
```

### Worker

```bash
dotnet run --project backend/src/SmartRfqFlow.Worker/SmartRfqFlow.Worker.csproj
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects `http://localhost:5058` by default and falls back to local demo data if the API is offline.

## Quality and repo hygiene

- solution file at `SmartRfqFlow.sln`
- CI workflow ready in `.github/workflows/ci.yml`
- root `.gitignore` covers .NET, Node and local build artifacts
- tests cover RFQ workflow rules plus catalog import behavior

## Next upgrades

1. Replace in-memory persistence with EF Core + PostgreSQL.
2. Add JWT authentication and role-based authorization.
3. Introduce RabbitMQ and idempotent async processing.
4. Add CSV or Excel catalog ingestion.
5. Add Playwright E2E coverage.
