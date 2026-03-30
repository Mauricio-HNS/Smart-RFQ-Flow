import { NavLink, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api";
import type { Customer, DashboardOverview, Product, Rfq } from "./types";

function Currency({ value }: { value: number }) {
  return <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)}</span>;
}

function DashboardPage({ overview, rfqs }: { overview: DashboardOverview; rfqs: Rfq[] }) {
  return (
    <div className="page-grid">
      <section className="hero-card">
        <p className="eyebrow">Enterprise workflow orchestration</p>
        <h1>Smart RFQ Flow</h1>
        <p className="hero-copy">
          A mini-enterprise platform that simulates the complete RFQ-to-Offer lifecycle with approvals, pricing orchestration, auditability and analytics.
        </p>
      </section>
      <section className="stats-grid">
        <article className="stat-card"><span>Total RFQs</span><strong>{overview.totalRfqs}</strong></article>
        <article className="stat-card"><span>Pending approvals</span><strong>{overview.pendingApprovals}</strong></article>
        <article className="stat-card"><span>Approved</span><strong>{overview.approvedRfqs}</strong></article>
        <article className="stat-card"><span>Offer value</span><strong><Currency value={overview.totalOfferAmount} /></strong></article>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>RFQ Pipeline</h2>
          <span>{overview.averageApprovalLeadTimeHours}h avg approval time</span>
        </div>
        <div className="timeline-list">
          {rfqs.map((rfq) => (
            <div key={rfq.id} className="timeline-row">
              <div>
                <strong>{rfq.number}</strong>
                <p>{rfq.customerName}</p>
              </div>
              <span className={`status-pill status-${rfq.status}`}>{rfq.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RfqsPage({ rfqs }: { rfqs: Rfq[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>RFQs</h2>
        <span>{rfqs.length} active opportunities</span>
      </div>
      <div className="table-grid">
        {rfqs.map((rfq) => (
          <article key={rfq.id} className="table-card">
            <header>
              <strong>{rfq.number}</strong>
              <span className={`status-pill status-${rfq.status}`}>{rfq.status}</span>
            </header>
            <p>{rfq.customerName}</p>
            <small>Delivery target: {rfq.desiredDeliveryDate}</small>
            <small>{rfq.items.length} item(s)</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function CatalogPage({ customers, products }: { customers: Customer[]; products: Product[] }) {
  return (
    <div className="page-grid two-columns">
      <section className="panel">
        <div className="panel-header">
          <h2>Customers</h2>
          <span>{customers.length} accounts</span>
        </div>
        <div className="stack-list">
          {customers.map((customer) => (
            <article key={customer.id} className="stack-card">
              <strong>{customer.name}</strong>
              <p>{customer.segment} · {customer.country}</p>
              <small>{customer.contactEmail}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Products</h2>
          <span>{products.length} SKUs</span>
        </div>
        <div className="stack-list">
          {products.map((product) => (
            <article key={product.id} className="stack-card">
              <strong>{product.name}</strong>
              <p>{product.sku}</p>
              <small><Currency value={product.basePrice} /> · {product.stockAvailable} in stock</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnalyticsPage({ overview }: { overview: DashboardOverview }) {
  const segments = [
    { label: "Submitted", value: 14 },
    { label: "Pricing", value: 9 },
    { label: "Approval", value: 6 },
    { label: "Offer", value: 4 }
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Analytics</h2>
        <span>Portfolio interview ready KPIs</span>
      </div>
      <div className="funnel-grid">
        {segments.map((segment, index) => (
          <div key={segment.label} className="funnel-step" style={{ width: `${100 - index * 12}%` }}>
            <strong>{segment.value}</strong>
            <span>{segment.label}</span>
          </div>
        ))}
      </div>
      <div className="stats-grid compact">
        <article className="stat-card"><span>Approval rate</span><strong>72%</strong></article>
        <article className="stat-card"><span>Rejected</span><strong>{overview.rejectedRfqs}</strong></article>
        <article className="stat-card"><span>Lead time</span><strong>{overview.averageApprovalLeadTimeHours}h</strong></article>
      </div>
    </section>
  );
}

export default function App() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);

  useEffect(() => {
    void Promise.all([
      api.getOverview().then(setOverview),
      api.getCustomers().then(setCustomers),
      api.getProducts().then(setProducts),
      api.getRfqs().then(setRfqs)
    ]);
  }, []);

  if (!overview) {
    return <div className="loading-shell">Loading Smart RFQ Flow...</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Sales orchestration</p>
          <h1>SRFQ</h1>
        </div>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/rfqs">RFQs</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage overview={overview} rfqs={rfqs} />} />
          <Route path="/rfqs" element={<RfqsPage rfqs={rfqs} />} />
          <Route path="/catalog" element={<CatalogPage customers={customers} products={products} />} />
          <Route path="/analytics" element={<AnalyticsPage overview={overview} />} />
        </Routes>
      </main>
    </div>
  );
}
