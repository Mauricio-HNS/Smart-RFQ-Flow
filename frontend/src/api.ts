import {
  auditLogs as fallbackAuditLogs,
  catalogProducts as fallbackCatalogProducts,
  customers as fallbackCustomers,
  integrationLogs as fallbackIntegrationLogs,
  offers as fallbackOffers,
  overview as fallbackOverview,
  products as fallbackProducts,
  rfqs as fallbackRfqs
} from "./data";
import type { AuditLog, CatalogImportResponse, CatalogSearchResponse, CatalogSummary, Customer, DashboardOverview, IntegrationLog, Offer, Product, Rfq } from "./types";

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
  getCatalogSummary: () => getJson<CatalogSummary>("/api/catalog/summary", {
    totalProducts: fallbackCatalogProducts.length,
    inStockProducts: fallbackCatalogProducts.filter((product) => product.stockAvailable > 0).length,
    outOfStockProducts: fallbackCatalogProducts.filter((product) => product.stockAvailable === 0).length,
    distinctManufacturers: Array.from(new Set(fallbackCatalogProducts.map((product) => product.manufacturer))).length,
    distinctCategories: Array.from(new Set(fallbackCatalogProducts.map((product) => product.category))).length,
    topRegions: Array.from(new Set(fallbackCatalogProducts.map((product) => product.region))).slice(0, 3)
  }),
  searchCatalog: async (query: { search?: string; category?: string; manufacturer?: string; region?: string; inStockOnly?: boolean; page?: number; pageSize?: number; }) => {
    const params = new URLSearchParams();

    if (query.search) params.set("search", query.search);
    if (query.category) params.set("category", query.category);
    if (query.manufacturer) params.set("manufacturer", query.manufacturer);
    if (query.region) params.set("region", query.region);
    if (query.inStockOnly) params.set("inStockOnly", "true");
    params.set("page", String(query.page ?? 1));
    params.set("pageSize", String(query.pageSize ?? 24));

    const fallbackPage = query.page ?? 1;
    const fallbackPageSize = query.pageSize ?? 24;
    const filtered = fallbackCatalogProducts.filter((product) => {
      const matchesSearch = query.search
        ? `${product.name} ${product.sku} ${product.description ?? ""}`.toLowerCase().includes(query.search.toLowerCase())
        : true;
      const matchesCategory = query.category ? product.category === query.category : true;
      const matchesManufacturer = query.manufacturer ? product.manufacturer === query.manufacturer : true;
      const matchesRegion = query.region ? product.region === query.region : true;
      const matchesStock = query.inStockOnly ? product.stockAvailable > 0 : true;

      return matchesSearch && matchesCategory && matchesManufacturer && matchesRegion && matchesStock;
    });

    const fallback: CatalogSearchResponse = {
      items: filtered.slice((fallbackPage - 1) * fallbackPageSize, fallbackPage * fallbackPageSize),
      totalItems: filtered.length,
      page: fallbackPage,
      pageSize: fallbackPageSize,
      categories: Array.from(new Set(fallbackCatalogProducts.map((product) => product.category))).sort(),
      manufacturers: Array.from(new Set(fallbackCatalogProducts.map((product) => product.manufacturer))).sort(),
      regions: Array.from(new Set(fallbackCatalogProducts.map((product) => product.region))).sort()
    };

    return getJson<CatalogSearchResponse>(`/api/catalog/search?${params.toString()}`, fallback);
  },
  importCatalog: (sourceName: string, items: Product[]) =>
    postJson<CatalogImportResponse>("/api/catalog/import", {
      sourceName,
      items: items.map((item) => ({
        sku: item.sku,
        name: item.name,
        category: item.category,
        manufacturer: item.manufacturer,
        region: item.region,
        description: item.description,
        basePrice: item.basePrice,
        currency: item.currency,
        leadTimeDays: item.leadTimeDays,
        stockAvailable: item.stockAvailable
      }))
    }, {
      sourceName,
      importedItems: items.length,
      totalProductsAfterImport: fallbackCatalogProducts.length + items.length
    }),
  approveRfq: (id: string) =>
    postJson<Rfq>(`/api/rfqs/${id}/approve`, { approvedBy: "22222222-2222-2222-2222-222222222222", comment: "Approved in demo workflow." }, fallbackRfqs[0]),
  rejectRfq: (id: string) =>
    postJson<Rfq>(`/api/rfqs/${id}/reject`, { approvedBy: "22222222-2222-2222-2222-222222222222", comment: "Rejected in demo workflow." }, fallbackRfqs[0]),
  generateOffer: (id: string) =>
    postJson<Offer>(`/api/rfqs/${id}/generate-offer`, {}, fallbackOffers[0]),
  sendOffer: (id: string) =>
    postJson<Offer>(`/api/offers/${id}/send`, { recipientEmail: "buyer@nordicretail.example", channel: "Email" }, fallbackOffers[0])
};
