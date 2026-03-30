import { customers as fallbackCustomers, overview as fallbackOverview, products as fallbackProducts, rfqs as fallbackRfqs } from "./data";
import type { Customer, DashboardOverview, Product, Rfq } from "./types";

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

export const api = {
  getOverview: () => getJson<DashboardOverview>("/api/analytics/overview", fallbackOverview),
  getCustomers: () => getJson<Customer[]>("/api/customers", fallbackCustomers),
  getProducts: () => getJson<Product[]>("/api/products", fallbackProducts),
  getRfqs: () => getJson<Rfq[]>("/api/rfqs", fallbackRfqs)
};
