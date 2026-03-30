import { NavLink, Route, Routes } from "react-router-dom";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { AuditLog, CatalogSearchResponse, CatalogSummary, Customer, DashboardOverview, IntegrationLog, Offer, Product, Rfq } from "./types";

function Currency({ value }: { value: number }) {
  return <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)}</span>;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not sent yet";
  }

  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  });
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

function ApprovalPage({
  rfqs,
  onApprove,
  onReject,
  onGenerateOffer
}: {
  rfqs: Rfq[];
  onApprove: (rfqId: string) => void;
  onReject: (rfqId: string) => void;
  onGenerateOffer: (rfqId: string) => void;
}) {
  const queue = rfqs.filter((rfq) => rfq.status === "WaitingApproval" || rfq.status === "Approved");

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Approval Desk</h2>
        <span>{queue.length} RFQs in manager scope</span>
      </div>
      <div className="table-grid">
        {queue.map((rfq) => (
          <article key={rfq.id} className="table-card">
            <header>
              <strong>{rfq.number}</strong>
              <span className={`status-pill status-${rfq.status}`}>{rfq.status}</span>
            </header>
            <p>{rfq.customerName}</p>
            <small>{rfq.items.length} line(s)</small>
            <div className="action-row">
              {rfq.status === "WaitingApproval" ? (
                <>
                  <button onClick={() => onApprove(rfq.id)}>Approve</button>
                  <button className="ghost-button" onClick={() => onReject(rfq.id)}>Reject</button>
                </>
              ) : (
                <button onClick={() => onGenerateOffer(rfq.id)}>Generate offer</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OffersPage({ offers, rfqs, onSendOffer }: { offers: Offer[]; rfqs: Rfq[]; onSendOffer: (offerId: string) => void }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Offer Center</h2>
        <span>{offers.length} generated offers</span>
      </div>
      <div className="table-grid">
        {offers.map((offer) => {
          const rfq = rfqs.find((item) => item.id === offer.rfqId);

          return (
            <article key={offer.id} className="table-card">
              <header>
                <strong>Offer v{offer.version}</strong>
                <span className={`status-pill ${offer.sentAt ? "status-SentToCustomer" : "status-Approved"}`}>
                  {offer.sentAt ? "SentToCustomer" : "ReadyToSend"}
                </span>
              </header>
              <p>{rfq?.number ?? offer.rfqId}</p>
              <small><Currency value={offer.totalAmount} /> · {offer.currency}</small>
              <small>{formatDate(offer.sentAt)}</small>
              {!offer.sentAt && (
                <div className="action-row">
                  <button onClick={() => onSendOffer(offer.id)}>Send offer</button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CatalogPage({
  customers,
  products,
  catalog,
  filters,
  onFiltersChange,
  onPageChange
}: {
  customers: Customer[];
  products: Product[];
  catalog: CatalogSearchResponse | null;
  filters: { search: string; category: string; manufacturer: string; region: string; inStockOnly: boolean; page: number; pageSize: number; };
  onFiltersChange: (changes: Partial<{ search: string; category: string; manufacturer: string; region: string; inStockOnly: boolean; page: number; pageSize: number; }>) => void;
  onPageChange: (page: number) => void;
}) {
  const totalPages = catalog ? Math.max(1, Math.ceil(catalog.totalItems / catalog.pageSize)) : 1;

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="panel-header">
          <h2>Industrial Catalog Explorer</h2>
          <span>{catalog?.totalItems ?? 0} matching products</span>
        </div>
        <div className="form-grid">
          <label>
            Search
            <input value={filters.search} onChange={(event) => onFiltersChange({ search: event.target.value, page: 1 })} placeholder="SKU, name or description" />
          </label>
          <label>
            Category
            <select value={filters.category} onChange={(event) => onFiltersChange({ category: event.target.value, page: 1 })}>
              <option value="">All categories</option>
              {catalog?.categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>
            Manufacturer
            <select value={filters.manufacturer} onChange={(event) => onFiltersChange({ manufacturer: event.target.value, page: 1 })}>
              <option value="">All manufacturers</option>
              {catalog?.manufacturers.map((manufacturer) => <option key={manufacturer} value={manufacturer}>{manufacturer}</option>)}
            </select>
          </label>
          <label>
            Region
            <select value={filters.region} onChange={(event) => onFiltersChange({ region: event.target.value, page: 1 })}>
              <option value="">All regions</option>
              {catalog?.regions.map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={filters.inStockOnly} onChange={(event) => onFiltersChange({ inStockOnly: event.target.checked, page: 1 })} />
            Only show in-stock products
          </label>
        </div>
        <div className="catalog-grid">
          {catalog?.items.map((product) => (
            <article key={product.id} className="table-card">
              <header>
                <strong>{product.name}</strong>
                <span className={`status-pill ${product.stockAvailable > 0 ? "status-Approved" : "status-Rejected"}`}>
                  {product.stockAvailable > 0 ? "InStock" : "Backorder"}
                </span>
              </header>
              <p>{product.sku}</p>
              <small>{product.category} · {product.manufacturer} · {product.region}</small>
              <small>{product.description}</small>
              <small><Currency value={product.basePrice} /> · Lead time {product.leadTimeDays} days</small>
            </article>
          ))}
        </div>
        <div className="pagination-row">
          <button className="ghost-button" disabled={filters.page <= 1} onClick={() => onPageChange(filters.page - 1)}>Previous</button>
          <span>Page {filters.page} of {totalPages}</span>
          <button className="ghost-button" disabled={filters.page >= totalPages} onClick={() => onPageChange(filters.page + 1)}>Next</button>
        </div>
      </section>
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

function NewRfqPage({
  customers,
  products,
  onCreate
}: {
  customers: Customer[];
  products: Product[];
  onCreate: (payload: { customerId: string; productId: string; quantity: number; notes: string }) => void;
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState(5);
  const [notes, setNotes] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate({ customerId, productId, quantity, notes });
    setNotes("");
    setQuantity(5);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Create RFQ</h2>
        <span>Demo workflow entry point</span>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Customer
          <select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </select>
        </label>
        <label>
          Product
          <select value={productId} onChange={(event) => setProductId(event.target.value)}>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </label>
        <label>
          Quantity
          <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
        </label>
        <label className="full-span">
          Notes
          <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Commercial context, delivery notes, negotiation details..." />
        </label>
        <button type="submit">Create draft RFQ</button>
      </form>
    </section>
  );
}

function OperationsPage({ auditLogs, integrationLogs }: { auditLogs: AuditLog[]; integrationLogs: IntegrationLog[] }) {
  return (
    <div className="page-grid two-columns">
      <section className="panel">
        <div className="panel-header">
          <h2>Audit Trail</h2>
          <span>{auditLogs.length} entries</span>
        </div>
        <div className="stack-list">
          {auditLogs.map((entry) => (
            <article key={entry.id} className="stack-card">
              <strong>{entry.action}</strong>
              <p>{entry.entityName} · {entry.entityId}</p>
              <small>{formatDate(entry.timestamp)}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Integrations</h2>
          <span>{integrationLogs.length} events</span>
        </div>
        <div className="stack-list">
          {integrationLogs.map((entry) => (
            <article key={entry.id} className="stack-card">
              <strong>{entry.operation}</strong>
              <p>{entry.sourceSystem} → {entry.targetSystem}</p>
              <small>{entry.status} · {formatDate(entry.createdAt)}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SourcingPage({
  summary,
  onImport
}: {
  summary: CatalogSummary | null;
  onImport: () => void;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Sourcing Console</h2>
        <span>Catalog operations for industrial procurement teams</span>
      </div>
      <div className="stats-grid compact">
        <article className="stat-card"><span>Total products</span><strong>{summary?.totalProducts ?? 0}</strong></article>
        <article className="stat-card"><span>In stock</span><strong>{summary?.inStockProducts ?? 0}</strong></article>
        <article className="stat-card"><span>Manufacturers</span><strong>{summary?.distinctManufacturers ?? 0}</strong></article>
      </div>
      <div className="stack-list">
        <article className="stack-card">
          <strong>Bulk catalog import</strong>
          <p>Simulates supplier batch ingestion for industrial price lists and new product waves.</p>
          <small>Top regions: {summary?.topRegions.join(", ")}</small>
          <div className="action-row">
            <button onClick={onImport}>Import supplier batch</button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function App() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);
  const [catalog, setCatalog] = useState<CatalogSearchResponse | null>(null);
  const [catalogSummary, setCatalogSummary] = useState<CatalogSummary | null>(null);
  const [catalogFilters, setCatalogFilters] = useState({
    search: "",
    category: "",
    manufacturer: "",
    region: "",
    inStockOnly: false,
    page: 1,
    pageSize: 24
  });

  const nextOverview = useMemo<DashboardOverview>(() => {
    if (!overview) {
      return {
        totalRfqs: 0,
        pendingApprovals: 0,
        approvedRfqs: 0,
        rejectedRfqs: 0,
        totalOfferAmount: 0,
        averageApprovalLeadTimeHours: 0
      };
    }

    return {
      ...overview,
      totalRfqs: rfqs.length,
      pendingApprovals: rfqs.filter((rfq) => rfq.status === "WaitingApproval").length,
      approvedRfqs: rfqs.filter((rfq) => rfq.status === "Approved" || rfq.status === "OfferGenerated" || rfq.status === "SentToCustomer").length,
      totalOfferAmount: offers.reduce((sum, offer) => sum + offer.totalAmount, 0)
    };
  }, [offers, overview, rfqs]);

  useEffect(() => {
    void Promise.all([
      api.getOverview().then(setOverview),
      api.getCustomers().then(setCustomers),
      api.getProducts().then(setProducts),
      api.getRfqs().then(setRfqs),
      api.getOffers().then(setOffers),
      api.getAuditLogs().then(setAuditLogs),
      api.getIntegrationLogs().then(setIntegrationLogs),
      api.searchCatalog({ page: 1, pageSize: 24 }).then(setCatalog),
      api.getCatalogSummary().then(setCatalogSummary)
    ]);
  }, []);

  useEffect(() => {
    void api.searchCatalog(catalogFilters).then(setCatalog);
  }, [catalogFilters]);

  if (!overview) {
    return <div className="loading-shell">Loading Smart RFQ Flow...</div>;
  }

  const appendAudit = (action: string, entityName: string, entityId: string) => {
    setAuditLogs((current) => [
      {
        id: crypto.randomUUID(),
        action,
        entityName,
        entityId,
        performedBy: "demo-user",
        timestamp: new Date().toISOString()
      },
      ...current
    ]);
  };

  const handleApprove = async (rfqId: string) => {
    await api.approveRfq(rfqId);
    setRfqs((current) => current.map((rfq) => rfq.id === rfqId ? { ...rfq, status: "Approved" } : rfq));
    appendAudit("RfqApproved", "Rfq", rfqId);
  };

  const handleReject = async (rfqId: string) => {
    await api.rejectRfq(rfqId);
    setRfqs((current) => current.map((rfq) => rfq.id === rfqId ? { ...rfq, status: "Rejected" } : rfq));
    appendAudit("RfqRejected", "Rfq", rfqId);
  };

  const handleGenerateOffer = async (rfqId: string) => {
    const offer = await api.generateOffer(rfqId);
    setRfqs((current) => current.map((rfq) => rfq.id === rfqId ? { ...rfq, status: "OfferGenerated" } : rfq));
    setOffers((current) => {
      if (current.some((item) => item.rfqId === rfqId)) {
        return current;
      }

      const rfq = rfqs.find((item) => item.id === rfqId);
      const totalAmount = rfq?.items.reduce((sum, item) => sum + (item.finalPrice ?? item.requestedPrice) * item.quantity, 0) ?? offer.totalAmount;

      return [
        {
          id: offer.id ?? crypto.randomUUID(),
          rfqId,
          version: 1,
          totalAmount,
          currency: "EUR",
          generatedAt: new Date().toISOString(),
          sentAt: null
        },
        ...current
      ];
    });
    appendAudit("OfferGenerated", "Rfq", rfqId);
  };

  const handleSendOffer = async (offerId: string) => {
    await api.sendOffer(offerId);
    setOffers((current) => current.map((offer) => offer.id === offerId ? { ...offer, sentAt: new Date().toISOString() } : offer));
    appendAudit("OfferSent", "Offer", offerId);
  };

  const handleCreateRfq = ({ customerId, productId, quantity, notes }: { customerId: string; productId: string; quantity: number; notes: string }) => {
    const customer = customers.find((item) => item.id === customerId);
    const product = products.find((item) => item.id === productId);

    if (!customer || !product) {
      return;
    }

    const newRfq: Rfq = {
      id: crypto.randomUUID(),
      number: `RFQ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(rfqs.length + 1).padStart(3, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      createdBy: "11111111-1111-1111-1111-111111111111",
      createdAt: new Date().toISOString(),
      desiredDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
      notes,
      status: "Draft",
      items: [
        {
          id: crypto.randomUUID(),
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity,
          requestedPrice: product.basePrice,
          finalPrice: null
        }
      ]
    };

    setRfqs((current) => [newRfq, ...current]);
    appendAudit("RfqCreated", "Rfq", newRfq.id);
  };

  const handleCatalogFilterChange = (changes: Partial<typeof catalogFilters>) => {
    setCatalogFilters((current) => ({ ...current, ...changes }));
  };

  const handleCatalogImport = async () => {
    const importedItems: Product[] = [
      {
        id: crypto.randomUUID(),
        sku: "SUP-DRV-90001",
        name: "Supplier Drive Assembly",
        category: "Motors",
        manufacturer: "ABB",
        region: "EMEA",
        description: "Imported supplier drive assembly batch for sourcing validation.",
        basePrice: 890,
        currency: "EUR",
        leadTimeDays: 16,
        stockAvailable: 24
      },
      {
        id: crypto.randomUUID(),
        sku: "SUP-SWG-90002",
        name: "Supplier Switchgear Rack",
        category: "Switchgear",
        manufacturer: "Schneider",
        region: "LATAM",
        description: "Imported switchgear rack for regional sourcing campaign.",
        basePrice: 1320,
        currency: "EUR",
        leadTimeDays: 22,
        stockAvailable: 11
      }
    ];

    await api.importCatalog("SupplierBatchDemo", importedItems);
    appendAudit("CatalogImported", "Catalog", "supplier-batch-demo");
    setCatalogSummary((current) => current
      ? {
          ...current,
          totalProducts: current.totalProducts + importedItems.length,
          inStockProducts: current.inStockProducts + importedItems.filter((item) => item.stockAvailable > 0).length,
          distinctManufacturers: current.distinctManufacturers,
          distinctCategories: current.distinctCategories
        }
      : current);
    handleCatalogFilterChange({ page: 1 });
  };

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
          <NavLink to="/new-rfq">New RFQ</NavLink>
          <NavLink to="/approvals">Approvals</NavLink>
          <NavLink to="/offers">Offers</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/sourcing">Sourcing</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/operations">Operations</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage overview={nextOverview} rfqs={rfqs} />} />
          <Route path="/rfqs" element={<RfqsPage rfqs={rfqs} />} />
          <Route path="/new-rfq" element={<NewRfqPage customers={customers} products={products} onCreate={handleCreateRfq} />} />
          <Route path="/approvals" element={<ApprovalPage rfqs={rfqs} onApprove={handleApprove} onReject={handleReject} onGenerateOffer={handleGenerateOffer} />} />
          <Route path="/offers" element={<OffersPage offers={offers} rfqs={rfqs} onSendOffer={handleSendOffer} />} />
          <Route
            path="/catalog"
            element={
              <CatalogPage
                customers={customers}
                products={products}
                catalog={catalog}
                filters={catalogFilters}
                onFiltersChange={handleCatalogFilterChange}
                onPageChange={(page) => handleCatalogFilterChange({ page })}
              />
            }
          />
          <Route path="/sourcing" element={<SourcingPage summary={catalogSummary} onImport={handleCatalogImport} />} />
          <Route path="/analytics" element={<AnalyticsPage overview={nextOverview} />} />
          <Route path="/operations" element={<OperationsPage auditLogs={auditLogs} integrationLogs={integrationLogs} />} />
        </Routes>
      </main>
    </div>
  );
}
