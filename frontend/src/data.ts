import type { Customer, DashboardOverview, Product, Rfq } from "./types";

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
    basePrice: 490,
    currency: "EUR",
    leadTimeDays: 7,
    stockAvailable: 120
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    sku: "RFQ-SNS-200",
    name: "Advanced Sensor Pack",
    basePrice: 175,
    currency: "EUR",
    leadTimeDays: 14,
    stockAvailable: 42
  }
];

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
