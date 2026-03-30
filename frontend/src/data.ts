import type { AuditLog, Customer, DashboardOverview, IntegrationLog, Offer, Product, Rfq } from "./types";

export const overview: DashboardOverview = {
  totalRfqs: 14,
  pendingApprovals: 3,
  approvedRfqs: 8,
  rejectedRfqs: 2,
  totalOfferAmount: 124800,
  averageApprovalLeadTimeHours: 11.6
};

export const customers: Customer[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Nordic Retail Group",
    country: "Sweden",
    segment: "Retail",
    contactEmail: "procurement@nordicretail.example"
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Atlas Industrial",
    country: "Germany",
    segment: "Industrial",
    contactEmail: "buying@atlasindustrial.example"
  }
];

export const products: Product[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    sku: "RFQ-CPU-100",
    name: "Industrial Controller",
    category: "Controllers",
    manufacturer: "Siemens",
    region: "EMEA",
    description: "Modular controller for multi-line industrial automation environments.",
    basePrice: 490,
    currency: "EUR",
    leadTimeDays: 7,
    stockAvailable: 120
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    sku: "RFQ-SNS-200",
    name: "Advanced Sensor Pack",
    category: "Sensors",
    manufacturer: "Honeywell",
    region: "EMEA",
    description: "Multi-signal sensor pack for predictive maintenance programs.",
    basePrice: 175,
    currency: "EUR",
    leadTimeDays: 14,
    stockAvailable: 42
  }
];

const categories = ["Sensors", "Controllers", "Motors", "Valves", "Pumps", "Switchgear"];
const manufacturers = ["Siemens", "ABB", "Schneider", "Bosch Rexroth", "Honeywell", "Emerson"];
const regions = ["EMEA", "North America", "LATAM", "APAC"];

export const catalogProducts: Product[] = Array.from({ length: 600 }, (_, index) => {
  const category = categories[index % categories.length];
  const manufacturer = manufacturers[index % manufacturers.length];
  const region = regions[index % regions.length];
  const itemNumber = index + 1;

  return {
    id: `catalog-${itemNumber}`,
    sku: `IND-${category.slice(0, 3).toUpperCase()}-${String(itemNumber).padStart(5, "0")}`,
    name: `${manufacturer} ${category} Module ${String(itemNumber).padStart(4, "0")}`,
    category,
    manufacturer,
    region,
    description: `Industrial-grade ${category.toLowerCase()} component designed for ${region} sourcing programs.`,
    basePrice: 80 + (itemNumber % 45) * 17,
    currency: "EUR",
    leadTimeDays: 3 + itemNumber % 21,
    stockAvailable: itemNumber % 9 === 0 ? 0 : 20 + itemNumber % 180
  };
});

export const rfqs: Rfq[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    number: "RFQ-20260330-001",
    customerId: customers[0].id,
    customerName: customers[0].name,
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-03-30T05:00:00Z",
    desiredDeliveryDate: "2026-04-19",
    notes: "Urgent pilot batch for Nordic rollout.",
    status: "WaitingApproval",
    items: [
      {
        id: "40000000-0000-0000-0000-000000000001",
        productId: products[0].id,
        productName: products[0].name,
        productSku: products[0].sku,
        quantity: 10,
        requestedPrice: 470,
        finalPrice: 465
      }
    ]
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    number: "RFQ-20260330-002",
    customerId: customers[1].id,
    customerName: customers[1].name,
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-03-29T16:00:00Z",
    desiredDeliveryDate: "2026-04-25",
    notes: "Bundle quote for sensor retrofit.",
    status: "OfferGenerated",
    items: [
      {
        id: "40000000-0000-0000-0000-000000000002",
        productId: products[1].id,
        productName: products[1].name,
        productSku: products[1].sku,
        quantity: 25,
        requestedPrice: 169,
        finalPrice: 166
      }
    ]
  }
];

export const offers: Offer[] = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    rfqId: "30000000-0000-0000-0000-000000000002",
    version: 1,
    totalAmount: 4150,
    currency: "EUR",
    generatedAt: "2026-03-29T18:15:00Z",
    sentAt: null
  }
];

export const auditLogs: AuditLog[] = [
  {
    id: "60000000-0000-0000-0000-000000000001",
    entityName: "Rfq",
    entityId: "30000000-0000-0000-0000-000000000001",
    action: "RfqSubmitted",
    performedBy: "11111111-1111-1111-1111-111111111111",
    timestamp: "2026-03-30T05:05:00Z"
  },
  {
    id: "60000000-0000-0000-0000-000000000002",
    entityName: "Offer",
    entityId: "50000000-0000-0000-0000-000000000001",
    action: "OfferGenerated",
    performedBy: "11111111-1111-1111-1111-111111111111",
    timestamp: "2026-03-29T18:15:00Z"
  }
];

export const integrationLogs: IntegrationLog[] = [
  {
    id: "70000000-0000-0000-0000-000000000001",
    sourceSystem: "SmartRFQ",
    targetSystem: "SAP",
    operation: "PricingSimulation",
    status: "Success",
    requestPayload: "RFQ-20260330-001",
    responsePayload: "Pricing simulation completed.",
    createdAt: "2026-03-30T05:10:00Z"
  },
  {
    id: "70000000-0000-0000-0000-000000000002",
    sourceSystem: "SmartRFQ",
    targetSystem: "Salesforce",
    operation: "OpportunityLookup",
    status: "Success",
    requestPayload: "OPP-EMEA-1001",
    responsePayload: "Opportunity fetched.",
    createdAt: "2026-03-30T05:12:00Z"
  }
];
