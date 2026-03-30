using SmartRfqFlow.Application.Abstractions;
using SmartRfqFlow.Domain.Entities;
using SmartRfqFlow.Domain.Enums;

namespace SmartRfqFlow.Infrastructure.Persistence;

public sealed class InMemorySmartRfqRepository : ISmartRfqRepository
{
    private static readonly string[] CatalogCategories = ["Sensors", "Controllers", "Motors", "Valves", "Pumps", "Switchgear"];
    private static readonly string[] CatalogManufacturers = ["Siemens", "ABB", "Schneider", "Bosch Rexroth", "Honeywell", "Emerson"];
    private static readonly string[] CatalogRegions = ["EMEA", "North America", "LATAM", "APAC"];
    private readonly List<User> _users;
    private readonly List<Customer> _customers;
    private readonly List<Product> _products;
    private readonly List<Rfq> _rfqs;
    private readonly List<Approval> _approvals = [];
    private readonly List<Offer> _offers = [];
    private readonly List<AuditLog> _auditLogs = [];
    private readonly List<IntegrationLog> _integrationLogs = [];
    private readonly List<ProcessedMessage> _processedMessages = [];

    public InMemorySmartRfqRepository()
    {
        _users =
        [
            new User
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Nina Costa",
                Email = "nina.costa@smartrfqflow.com",
                Role = UserRole.SalesRep
            },
            new User
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Marco Reis",
                Email = "marco.reis@smartrfqflow.com",
                Role = UserRole.Manager
            }
        ];

        _customers =
        [
            new Customer
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Name = "Nordic Retail Group",
                Country = "Sweden",
                Segment = "Retail",
                ContactEmail = "procurement@nordicretail.example"
            },
            new Customer
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Name = "Atlas Industrial",
                Country = "Germany",
                Segment = "Industrial",
                ContactEmail = "buying@atlasindustrial.example"
            }
        ];

        _products = BuildIndustrialCatalog();

        var seededRfq = new Rfq
        {
            Id = Guid.Parse("30000000-0000-0000-0000-000000000001"),
            Number = "RFQ-20260330-001",
            CustomerId = _customers[0].Id,
            CustomerName = _customers[0].Name,
            CreatedBy = _users[0].Id,
            CreatedAt = DateTimeOffset.UtcNow.AddHours(-18),
            DesiredDeliveryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(20)),
            Notes = "Urgent pilot batch for Nordic rollout."
        };

        seededRfq.AddItem(new RfqItem
        {
            Id = Guid.Parse("40000000-0000-0000-0000-000000000001"),
            ProductId = _products[0].Id,
            ProductName = _products[0].Name,
            ProductSku = _products[0].Sku,
            Quantity = 10,
            RequestedPrice = 470m
        });

        seededRfq.Submit();
        seededRfq.MoveToPricing();
        seededRfq.MoveToApproval();
        _rfqs = [seededRfq];
    }

    public IReadOnlyCollection<User> GetUsers() => _users.AsReadOnly();
    public IReadOnlyCollection<Customer> GetCustomers() => _customers.AsReadOnly();
    public IReadOnlyCollection<Product> GetProducts() => _products.AsReadOnly();
    public IReadOnlyCollection<Rfq> GetRfqs() => _rfqs.AsReadOnly();
    public IReadOnlyCollection<Offer> GetOffers() => _offers.AsReadOnly();
    public IReadOnlyCollection<AuditLog> GetAuditLogs() => _auditLogs.AsReadOnly();
    public IReadOnlyCollection<Approval> GetApprovals() => _approvals.AsReadOnly();
    public IReadOnlyCollection<IntegrationLog> GetIntegrationLogs() => _integrationLogs.AsReadOnly();
    public IReadOnlyCollection<ProcessedMessage> GetProcessedMessages() => _processedMessages.AsReadOnly();
    public User? FindUser(Guid id) => _users.FirstOrDefault(item => item.Id == id);
    public Customer? FindCustomer(Guid id) => _customers.FirstOrDefault(item => item.Id == id);
    public Product? FindProduct(Guid id) => _products.FirstOrDefault(item => item.Id == id);
    public Rfq? FindRfq(Guid id) => _rfqs.FirstOrDefault(item => item.Id == id);
    public Offer? FindOffer(Guid id) => _offers.FirstOrDefault(item => item.Id == id);

    public Customer AddCustomer(Customer customer)
    {
        _customers.Add(customer);
        return customer;
    }

    public Product AddProduct(Product product)
    {
        _products.Add(product);
        return product;
    }

    public Rfq AddRfq(Rfq rfq)
    {
        _rfqs.Add(rfq);
        return rfq;
    }

    public Approval AddApproval(Approval approval)
    {
        _approvals.Add(approval);
        return approval;
    }

    public Offer AddOffer(Offer offer)
    {
        _offers.Add(offer);
        return offer;
    }

    public AuditLog AddAuditLog(AuditLog auditLog)
    {
        _auditLogs.Add(auditLog);
        return auditLog;
    }

    public IntegrationLog AddIntegrationLog(IntegrationLog integrationLog)
    {
        _integrationLogs.Add(integrationLog);
        return integrationLog;
    }

    public ProcessedMessage AddProcessedMessage(ProcessedMessage processedMessage)
    {
        _processedMessages.Add(processedMessage);
        return processedMessage;
    }

    private static List<Product> BuildIndustrialCatalog()
    {
        var products = new List<Product>
        {
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                Sku = "RFQ-CPU-100",
                Name = "Industrial Controller",
                Category = "Controllers",
                Manufacturer = "Siemens",
                Region = "EMEA",
                Description = "Modular controller for multi-line industrial automation environments.",
                BasePrice = 490m,
                Currency = "EUR",
                LeadTimeDays = 7,
                StockAvailable = 120
            },
            new()
            {
                Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                Sku = "RFQ-SNS-200",
                Name = "Advanced Sensor Pack",
                Category = "Sensors",
                Manufacturer = "Honeywell",
                Region = "EMEA",
                Description = "Multi-signal sensor pack for predictive maintenance programs.",
                BasePrice = 175m,
                Currency = "EUR",
                LeadTimeDays = 14,
                StockAvailable = 42
            }
        };

        for (var index = 1; index <= 1200; index++)
        {
            var category = CatalogCategories[index % CatalogCategories.Length];
            var manufacturer = CatalogManufacturers[index % CatalogManufacturers.Length];
            var region = CatalogRegions[index % CatalogRegions.Length];

            products.Add(new Product
            {
                Sku = $"IND-{category[..3].ToUpperInvariant()}-{index:00000}",
                Name = $"{manufacturer} {category} Module {index:0000}",
                Category = category,
                Manufacturer = manufacturer,
                Region = region,
                Description = $"Industrial-grade {category.ToLowerInvariant()} component for {region} catalog programs and enterprise sourcing workflows.",
                BasePrice = 80m + (index % 45) * 17m,
                Currency = "EUR",
                LeadTimeDays = 3 + index % 21,
                StockAvailable = index % 9 == 0 ? 0 : 20 + index % 180
            });
        }

        return products;
    }
}
