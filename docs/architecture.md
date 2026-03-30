# Architecture

## Style

Smart RFQ Flow is currently implemented as a modular monolith.

This choice keeps delivery fast while still making it easy to explain:

- clear domain boundaries
- lower operational complexity
- easier demo setup
- smoother future split into microservices

## Layers

### Domain

Contains the business entities and status transitions.

Examples:

- RFQ lifecycle
- offer generation rules
- approval status changes

### Application

Contains use-case orchestration.

Examples:

- create RFQ
- request pricing
- approve or reject RFQ
- generate and send offers
- build dashboard analytics responses

### Infrastructure

Contains repository and integration concerns.

The current implementation uses an in-memory repository to keep the MVP runnable with no database dependency, but the code is already shaped so this can evolve to EF Core + PostgreSQL.

### API

Contains the HTTP surface for business actions, analytics and fake external integrations.

### Worker

Represents the async/event-processing side of the platform. Right now it is a lightweight placeholder that can later host:

- RabbitMQ consumers
- retry workers
- analytics aggregation jobs
- idempotent message processors

## Future evolution

Recommended future extraction path:

1. Pricing
2. Offer
3. Notifications
4. Analytics pipeline

That keeps the highest-value business hotspots ready for scale while preserving the original modular monolith story for interviews.
