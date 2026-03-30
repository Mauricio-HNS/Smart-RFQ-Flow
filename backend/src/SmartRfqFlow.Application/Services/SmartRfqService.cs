using SmartRfqFlow.Application.Abstractions;
using SmartRfqFlow.Application.Contracts;
using SmartRfqFlow.Domain.Entities;
using SmartRfqFlow.Domain.Enums;

namespace SmartRfqFlow.Application.Services;

public sealed class SmartRfqService(ISmartRfqRepository repository)
{
    private const string DefaultCurrency = "EUR";

    public IReadOnlyCollection<Customer> GetCustomers() => repository.GetCustomers();
    public IReadOnlyCollection<Product> GetProducts() => repository.GetProducts();
    public IReadOnlyCollection<Rfq> GetRfqs() => repository.GetRfqs();
    public IReadOnlyCollection<Offer> GetOffers() => repository.GetOffers();
    public IReadOnlyCollection<AuditLog> GetAuditLogs() => repository.GetAuditLogs();
    public IReadOnlyCollection<Approval> GetApprovals() => repository.GetApprovals();
    public IReadOnlyCollection<IntegrationLog> GetIntegrationLogs() => repository.GetIntegrationLogs();

    public Customer GetCustomer(Guid id) =>
        repository.FindCustomer(id) ?? throw new InvalidOperationException("Customer not found.");

    public Product GetProduct(Guid id) =>
        repository.FindProduct(id) ?? throw new InvalidOperationException("Product not found.");

    public Rfq GetRfq(Guid id) => GetRequiredRfq(id);

    public Offer GetOffer(Guid id) =>
        repository.FindOffer(id) ?? throw new InvalidOperationException("Offer not found.");

    public DashboardOverviewResponse GetOverview()
    {
        var rfqs = repository.GetRfqs();
        var offers = repository.GetOffers();
        var averageApprovalLeadTime = rfqs
            .Where(rfq => rfq.Status is RfqStatus.Approved or RfqStatus.OfferGenerated)
            .Select(rfq => (DateTimeOffset.UtcNow - rfq.CreatedAt).TotalHours)
            .DefaultIfEmpty(0)
            .Average();

        return new DashboardOverviewResponse(
            rfqs.Count,
            rfqs.Count(rfq => rfq.Status == RfqStatus.WaitingApproval),
            rfqs.Count(rfq => rfq.Status is RfqStatus.Approved or RfqStatus.OfferGenerated),
            rfqs.Count(rfq => rfq.Status == RfqStatus.Rejected),
            offers.Sum(offer => offer.TotalAmount),
            Math.Round(averageApprovalLeadTime, 2));
    }

    public IReadOnlyCollection<RfqStatusBreakdownResponse> GetRfqStatusBreakdown() =>
        repository.GetRfqs()
            .GroupBy(rfq => rfq.Status.ToString())
            .Select(group => new RfqStatusBreakdownResponse(group.Key, group.Count()))
            .OrderByDescending(item => item.Count)
            .ToArray();

    public IReadOnlyCollection<ProcessingTimeResponse> GetProcessingTimes() =>
    [
        new("Approval", Math.Round(repository.GetRfqs().Average(rfq => (DateTimeOffset.UtcNow - rfq.CreatedAt).TotalHours), 2)),
        new("Pricing", 2.5),
        new("OfferGeneration", 1.2)
    ];

    public Customer CreateCustomer(CreateCustomerRequest request)
    {
        var customer = new Customer
        {
            Name = request.Name,
            Country = request.Country,
            Segment = request.Segment,
            ContactEmail = request.ContactEmail
        };

        repository.AddCustomer(customer);
        AppendAudit("Customer", customer.Id, "CustomerCreated", request.ContactEmail);
        return customer;
    }

    public Product CreateProduct(CreateProductRequest request)
    {
        var product = new Product
        {
            Sku = request.Sku,
            Name = request.Name,
            Category = request.Category,
            Manufacturer = request.Manufacturer,
            Region = request.Region,
            Description = request.Description,
            BasePrice = request.BasePrice,
            Currency = request.Currency,
            LeadTimeDays = request.LeadTimeDays,
            StockAvailable = request.StockAvailable
        };

        repository.AddProduct(product);
        AppendAudit("Product", product.Id, "ProductCreated", "system");
        return product;
    }

    public CatalogSearchResponse SearchCatalog(CatalogQueryRequest request)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 60);
        var query = repository.GetProducts().AsQueryable();

        // Keep search server-side so the UI never tries to load the whole industrial catalog at once.
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(product =>
                product.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                product.Sku.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                (product.Description != null && product.Description.Contains(search, StringComparison.OrdinalIgnoreCase)));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(product => product.Category.Equals(request.Category, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(request.Manufacturer))
        {
            query = query.Where(product => product.Manufacturer.Equals(request.Manufacturer, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(request.Region))
        {
            query = query.Where(product => product.Region.Equals(request.Region, StringComparison.OrdinalIgnoreCase));
        }

        if (request.InStockOnly)
        {
            query = query.Where(product => product.StockAvailable > 0);
        }

        var filteredProducts = query
            .OrderBy(product => product.Name)
            .ToArray();

        var items = filteredProducts
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(MapCatalogProduct)
            .ToArray();

        return new CatalogSearchResponse(
            items,
            filteredProducts.Length,
            page,
            pageSize,
            repository.GetProducts().Select(product => product.Category).Distinct().Order().ToArray(),
            repository.GetProducts().Select(product => product.Manufacturer).Distinct().Order().ToArray(),
            repository.GetProducts().Select(product => product.Region).Distinct().Order().ToArray());
    }

    public Rfq CreateRfq(CreateRfqRequest request)
    {
        var customer = repository.FindCustomer(request.CustomerId)
            ?? throw new InvalidOperationException("Customer not found.");
        _ = repository.FindUser(request.CreatedBy)
            ?? throw new InvalidOperationException("User not found.");

        if (request.Items.Count == 0)
        {
            throw new InvalidOperationException("RFQ must contain at least one item.");
        }

        var rfq = new Rfq
        {
            Number = $"RFQ-{DateTime.UtcNow:yyyyMMdd}-{repository.GetRfqs().Count + 1:000}",
            CustomerId = customer.Id,
            CustomerName = customer.Name,
            CreatedBy = request.CreatedBy,
            CreatedAt = DateTimeOffset.UtcNow,
            DesiredDeliveryDate = request.DesiredDeliveryDate,
            Notes = request.Notes
        };

        foreach (var itemRequest in request.Items)
        {
            var product = repository.FindProduct(itemRequest.ProductId)
                ?? throw new InvalidOperationException("Product not found.");

            rfq.AddItem(new RfqItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                ProductSku = product.Sku,
                Quantity = itemRequest.Quantity,
                RequestedPrice = itemRequest.RequestedPrice
            });
        }

        repository.AddRfq(rfq);
        AppendAudit("Rfq", rfq.Id, "RfqCreated", request.CreatedBy.ToString());
        return rfq;
    }

    public Rfq SubmitRfq(Guid rfqId)
    {
        var rfq = GetRequiredRfq(rfqId);
        rfq.Submit();
        rfq.MoveToPricing();
        rfq.MoveToApproval();
        AppendAudit("Rfq", rfq.Id, "RfqSubmitted", rfq.CreatedBy.ToString());
        return rfq;
    }

    public Approval ApproveRfq(Guid rfqId, ApprovalDecisionRequest request)
    {
        var rfq = GetRequiredRfq(rfqId);
        rfq.Approve();

        var approval = new Approval
        {
            RfqId = rfqId,
            ApprovedBy = request.ApprovedBy,
            Decision = "Approved",
            Comment = request.Comment,
            DecisionDate = DateTimeOffset.UtcNow
        };

        repository.AddApproval(approval);
        AppendAudit("Rfq", rfq.Id, "RfqApproved", request.ApprovedBy.ToString());
        return approval;
    }

    public Approval RejectRfq(Guid rfqId, ApprovalDecisionRequest request)
    {
        var rfq = GetRequiredRfq(rfqId);
        rfq.Reject();

        var approval = new Approval
        {
            RfqId = rfqId,
            ApprovedBy = request.ApprovedBy,
            Decision = "Rejected",
            Comment = request.Comment,
            DecisionDate = DateTimeOffset.UtcNow
        };

        repository.AddApproval(approval);
        AppendAudit("Rfq", rfq.Id, "RfqRejected", request.ApprovedBy.ToString());
        return approval;
    }

    public Rfq RequestPricing(Guid rfqId)
    {
        var rfq = GetRequiredRfq(rfqId);

        if (rfq.Status == RfqStatus.Submitted)
        {
            rfq.MoveToPricing();
        }

        AppendIntegrationLog("SmartRFQ", "SAP", "PricingRequest", "Success", $"RFQ {rfq.Number}", "Price and stock calculated.");
        AppendAudit("Rfq", rfq.Id, "PricingRequested", rfq.CreatedBy.ToString());

        return rfq;
    }

    public Offer GenerateOffer(Guid rfqId)
    {
        var rfq = GetRequiredRfq(rfqId);
        rfq.MarkOfferGenerated();

        var totalAmount = rfq.Items.Sum(item => (item.FinalPrice ?? item.RequestedPrice) * item.Quantity);
        var offer = new Offer
        {
            RfqId = rfq.Id,
            TotalAmount = totalAmount,
            Currency = DefaultCurrency,
            GeneratedAt = DateTimeOffset.UtcNow
        };

        repository.AddOffer(offer);
        repository.AddProcessedMessage(new ProcessedMessage
        {
            MessageId = $"offer-{offer.Id}",
            CorrelationId = rfq.Id.ToString(),
            MessageType = "OfferGenerated",
            ProcessedAt = DateTimeOffset.UtcNow
        });
        AppendAudit("Offer", offer.Id, "OfferGenerated", rfq.CreatedBy.ToString());
        return offer;
    }

    public Offer SendOffer(Guid offerId, SendOfferRequest request)
    {
        var offer = GetOffer(offerId);
        var rfq = GetRequiredRfq(offer.RfqId);

        offer.MarkAsSent(DateTimeOffset.UtcNow);
        rfq.MarkAsSent();

        AppendIntegrationLog("SmartRFQ", request.Channel, "OfferSend", "Success", request.RecipientEmail, $"Offer {offer.Id} sent.");
        AppendAudit("Offer", offer.Id, "OfferSent", request.RecipientEmail);
        return offer;
    }

    public object GetSalesforceOpportunity(string id)
    {
        AppendIntegrationLog("SmartRFQ", "Salesforce", "OpportunityLookup", "Success", id, "Opportunity fetched.");

        return new
        {
            opportunityId = id,
            accountName = "Nordic Retail Group",
            salesRegion = "EMEA North",
            source = "Key Account Expansion",
            estimatedValue = 128000
        };
    }

    public object GetSapPricing(Guid rfqId)
    {
        var rfq = GetRequiredRfq(rfqId);
        var pricingLines = rfq.Items.Select(item => new
        {
            item.ProductSku,
            listPrice = item.RequestedPrice + 15,
            approvedPrice = item.FinalPrice ?? item.RequestedPrice,
            stockConfirmed = true,
            leadTimeDays = 7
        });

        AppendIntegrationLog("SmartRFQ", "SAP", "PricingSimulation", "Success", rfq.Number, "Pricing simulation completed.");

        return new
        {
            rfqId,
            currency = DefaultCurrency,
            lines = pricingLines
        };
    }

    private Rfq GetRequiredRfq(Guid rfqId) =>
        repository.FindRfq(rfqId) ?? throw new InvalidOperationException("RFQ not found.");

    private static CatalogProductResponse MapCatalogProduct(Product product) =>
        new(
            product.Id,
            product.Sku,
            product.Name,
            product.Category,
            product.Manufacturer,
            product.Region,
            product.Description,
            product.BasePrice,
            product.Currency,
            product.LeadTimeDays,
            product.StockAvailable);

    private void AppendAudit(string entityName, Guid entityId, string action, string performedBy)
    {
        repository.AddAuditLog(new AuditLog
        {
            EntityName = entityName,
            EntityId = entityId.ToString(),
            Action = action,
            PerformedBy = performedBy,
            Timestamp = DateTimeOffset.UtcNow
        });
    }

    private void AppendIntegrationLog(string sourceSystem, string targetSystem, string operation, string status, string? requestPayload, string? responsePayload)
    {
        repository.AddIntegrationLog(new IntegrationLog
        {
            SourceSystem = sourceSystem,
            TargetSystem = targetSystem,
            Operation = operation,
            Status = status,
            RequestPayload = requestPayload,
            ResponsePayload = responsePayload,
            CreatedAt = DateTimeOffset.UtcNow
        });
    }
}
