# Smart RFQ Flow

Smart RFQ Flow is a mini-enterprise platform that simulates the full RFQ-to-Offer lifecycle, combining RFQ creation, approval workflow, offer generation, auditability, integration-ready architecture and a corporate dashboard.

## Current foundation

This repository now includes:

- modular monolith backend in ASP.NET Core with Domain, Application, Infrastructure, API and Worker projects
- in-memory demo repository with seeded users, customers, products and RFQs
- core RFQ workflow rules for create, submit, approve, reject and offer generation
- offer sending, audit trail and fake integration logs
- audit trail creation for major business actions
- React + TypeScript frontend with dashboard, RFQs, create flow, approvals, offers, catalog, analytics and operations views
- solution and Docker Compose base for local evolution
- CI workflow for build and test validation

## Repository structure

```text
Smart-RFQ-Flow/
├── backend/
│   ├── src/
│   │   ├── SmartRfqFlow.Api
│   │   ├── SmartRfqFlow.Application
│   │   ├── SmartRfqFlow.Domain
│   │   ├── SmartRfqFlow.Infrastructure
│   │   └── SmartRfqFlow.Worker
│   └── tests/
│       └── SmartRfqFlow.Tests
├── frontend/
├── docs/
├── docker-compose.yml
└── SmartRfqFlow.sln
```

## Implemented endpoints

- `POST /api/auth/login`
- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `GET /api/rfqs`
- `GET /api/rfqs/{id}`
- `POST /api/rfqs`
- `POST /api/rfqs/{id}/submit`
- `POST /api/rfqs/{id}/request-pricing`
- `POST /api/rfqs/{id}/approve`
- `POST /api/rfqs/{id}/reject`
- `POST /api/rfqs/{id}/generate-offer`
- `GET /api/offers`
- `GET /api/offers/{id}`
- `POST /api/offers/{id}/send`
- `GET /api/audit`
- `GET /api/audit/entity/{entityName}/{entityId}`
- `GET /api/analytics/overview`
- `GET /api/analytics/rfq-status`
- `GET /api/analytics/processing-time`
- `GET /api/analytics/conversion`
- `GET /api/integrations/logs`
- `GET /external/salesforce/opportunities/{id}`
- `POST /external/sap/pricing/{rfqId}`
- `GET /health`

## Run locally

### Backend API

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

The frontend expects the API at `http://localhost:5058` by default and falls back to local demo data if the backend is unavailable.

## Documentation

Technical notes live in:

- `docs/architecture.md`
- `docs/domain-workflow.md`
- `docs/api.md`

## Suggested next steps

1. Replace the in-memory repository with EF Core + PostgreSQL.
2. Add JWT auth, roles and policy-based authorization.
3. Introduce pricing integration adapters, retries and idempotent message handling.
4. Expand analytics into fact tables and event-driven aggregation.
5. Add Playwright E2E plus API integration tests.
