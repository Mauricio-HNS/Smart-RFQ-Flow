import {
  auditLogs as fallbackAuditLogs,
  customers as fallbackCustomers,
  integrationLogs as fallbackIntegrationLogs,
  offers as fallbackOffers,
  overview as fallbackOverview,
  products as fallbackProducts,
  rfqs as fallbackRfqs
} from "./data";
import type { AuditLog, Customer, DashboardOverview, IntegrationLog, Offer, Product, Rfq } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5058";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function postJson<T>(path: string, body: unknown, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  getOverview: () => getJson<DashboardOverview>("/api/analytics/overview", fallbackOverview),
  getCustomers: () => getJson<Customer[]>("/api/customers", fallbackCustomers),
  getProducts: () => getJson<Product[]>("/api/products", fallbackProducts),
  getRfqs: () => getJson<Rfq[]>("/api/rfqs", fallbackRfqs),
  getOffers: () => getJson<Offer[]>("/api/offers", fallbackOffers),
  getAuditLogs: () => getJson<AuditLog[]>("/api/audit", fallbackAuditLogs),
  getIntegrationLogs: () => getJson<IntegrationLog[]>("/api/integrations/logs", fallbackIntegrationLogs),
  approveRfq: (id: string) =>
    postJson<Rfq>(`/api/rfqs/${id}/approve`, { approvedBy: "22222222-2222-2222-2222-222222222222", comment: "Approved in demo workflow." }, fallbackRfqs[0]),
  rejectRfq: (id: string) =>
    postJson<Rfq>(`/api/rfqs/${id}/reject`, { approvedBy: "22222222-2222-2222-2222-222222222222", comment: "Rejected in demo workflow." }, fallbackRfqs[0]),
  generateOffer: (id: string) =>
    postJson<Offer>(`/api/rfqs/${id}/generate-offer`, {}, fallbackOffers[0]),
  sendOffer: (id: string) =>
    postJson<Offer>(`/api/offers/${id}/send`, { recipientEmail: "buyer@nordicretail.example", channel: "Email" }, fallbackOffers[0])
};
