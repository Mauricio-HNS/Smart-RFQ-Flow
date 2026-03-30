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
