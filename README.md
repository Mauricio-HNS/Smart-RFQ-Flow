# Smart RFQ Flow

<p align="center">
  <img src="https://img.shields.io/badge/ASP.NET%20Core-9-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="ASP.NET Core" />
  <img src="https://img.shields.io/badge/React-TypeScript-0f172a?style=for-the-badge&logo=react&logoColor=61dafb" alt="React TypeScript" />
  <img src="https://img.shields.io/badge/Architecture-Modular%20Monolith-153b52?style=for-the-badge" alt="Modular Monolith" />
</p>

Enterprise-style RFQ-to-Offer workflow built with ASP.NET Core and React. The project focuses on domain modeling, workflow orchestration, auditability and a clean migration path toward distributed infrastructure.

> Portfolio showcase. External Salesforce/SAP integrations and infrastructure components are simulated where noted.

## What it demonstrates

- RFQ lifecycle from draft through approval and offer delivery
- customer and product management
- pricing and approval workflows
- audit and integration logs
- catalog search, filtering and pagination
- analytics and operational metrics
- React + TypeScript business interface
- modular-monolith backend with explicit Domain/Application/Infrastructure boundaries

## Architecture

```text
React + TypeScript
        │
        ▼
ASP.NET Core API
        │
        ├── Application
        ├── Domain
        ├── Infrastructure
        └── Worker
```

The current implementation uses in-memory infrastructure for rapid local execution. PostgreSQL, JWT/RBAC, RabbitMQ and automated E2E testing are planned evolution paths rather than current production capabilities.

## Repository structure

```text
backend/
  src/SmartRfqFlow.Api
  src/SmartRfqFlow.Application
  src/SmartRfqFlow.Domain
  src/SmartRfqFlow.Infrastructure
  src/SmartRfqFlow.Worker
  tests/SmartRfqFlow.Tests
frontend/
docs/
.github/workflows/ci.yml
```

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

Detailed documentation:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/domain-workflow.md`](docs/domain-workflow.md)
- [`docs/api.md`](docs/api.md)

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

The frontend expects `http://localhost:5058` by default and falls back to local demo data when the API is offline.

## Engineering quality

- solution file at `SmartRfqFlow.slnx`
- CI workflow under `.github/workflows/ci.yml`
- tests for RFQ rules and catalog import behavior
- root `.gitignore` covering .NET and Node artifacts

## Roadmap

1. EF Core + PostgreSQL persistence
2. JWT authentication and RBAC
3. RabbitMQ with idempotent asynchronous processing
4. CSV/Excel catalog ingestion
5. Playwright E2E coverage

## Portfolio notes

See [`docs/portfolio/PROJECT_POSITIONING.md`](docs/portfolio/PROJECT_POSITIONING.md) for the intended scope and positioning.
