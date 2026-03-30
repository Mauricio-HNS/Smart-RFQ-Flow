# Domain Workflow

## RFQ lifecycle

The main RFQ lifecycle currently modeled in code is:

1. `Draft`
2. `Submitted`
3. `WaitingPricing`
4. `WaitingApproval`
5. `Approved` or `Rejected`
6. `OfferGenerated`
7. `SentToCustomer`

## Core rules

- RFQ cannot be submitted without items.
- Item quantity must be greater than zero.
- Only RFQs waiting for approval can be approved or rejected.
- Offer generation only happens after approval.
- Offer sending only happens after offer generation.

## Auditability

Important business actions create audit log entries:

- customer creation
- product creation
- RFQ creation
- RFQ submission
- approval or rejection
- offer generation
- offer sending

## Integration simulation

The current MVP includes fake integration points for:

- Salesforce opportunity lookup
- SAP pricing simulation

Every simulated call can be recorded in integration logs to support troubleshooting and future observability stories.
