# API Guide

## Business endpoints

### Auth

- `POST /api/auth/login`

### Customers

- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`

### Products

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `GET /api/catalog/search`
- `GET /api/catalog/summary`
- `POST /api/catalog/import`

Query parameters supported by `/api/catalog/search`:

- `search`
- `category`
- `manufacturer`
- `region`
- `inStockOnly`
- `page`
- `pageSize`

### RFQs

- `GET /api/rfqs`
- `GET /api/rfqs/{id}`
- `POST /api/rfqs`
- `POST /api/rfqs/{id}/submit`
- `POST /api/rfqs/{id}/request-pricing`
- `POST /api/rfqs/{id}/approve`
- `POST /api/rfqs/{id}/reject`
- `POST /api/rfqs/{id}/generate-offer`

### Offers

- `GET /api/offers`
- `GET /api/offers/{id}`
- `POST /api/offers/{id}/send`

### Audit

- `GET /api/audit`
- `GET /api/audit/entity/{entityName}/{entityId}`

### Analytics

- `GET /api/analytics/overview`
- `GET /api/analytics/rfq-status`
- `GET /api/analytics/processing-time`
- `GET /api/analytics/conversion`

## Fake external integrations

- `GET /external/salesforce/opportunities/{id}`
- `POST /external/sap/pricing/{rfqId}`

## Health

- `GET /health`
