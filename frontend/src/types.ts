export type RfqStatus =
  | "Draft"
  | "Submitted"
  | "UnderReview"
  | "WaitingPricing"
  | "WaitingApproval"
  | "Approved"
  | "Rejected"
  | "OfferGenerated"
  | "SentToCustomer"
  | "Accepted"
  | "Lost";

export interface Customer {
  id: string;
  name: string;
  country: string;
  segment: string;
  contactEmail: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  manufacturer: string;
  region: string;
  description?: string | null;
  basePrice: number;
  currency: string;
  leadTimeDays: number;
  stockAvailable: number;
}

export interface RfqItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  requestedPrice: number;
  finalPrice?: number | null;
}

export interface Rfq {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  createdBy: string;
  createdAt: string;
  desiredDeliveryDate: string;
  notes?: string | null;
  status: RfqStatus;
  items: RfqItem[];
}

export interface DashboardOverview {
  totalRfqs: number;
  pendingApprovals: number;
  approvedRfqs: number;
  rejectedRfqs: number;
  totalOfferAmount: number;
  averageApprovalLeadTimeHours: number;
}

export interface Offer {
  id: string;
  rfqId: string;
  version: number;
  totalAmount: number;
  currency: string;
  generatedAt: string;
  sentAt?: string | null;
}

export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  oldValues?: string | null;
  newValues?: string | null;
}

export interface IntegrationLog {
  id: string;
  sourceSystem: string;
  targetSystem: string;
  operation: string;
  status: string;
  requestPayload?: string | null;
  responsePayload?: string | null;
  createdAt: string;
}

export interface CatalogSearchResponse {
  items: Product[];
  totalItems: number;
  page: number;
  pageSize: number;
  categories: string[];
  manufacturers: string[];
  regions: string[];
}
