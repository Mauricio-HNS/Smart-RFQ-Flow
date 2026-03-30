namespace SmartRfqFlow.Application.Contracts;

public sealed record CreateCustomerRequest(
    string Name,
    string Country,
    string Segment,
    string ContactEmail);

public sealed record CreateProductRequest(
    string Sku,
    string Name,
    string Category,
    string Manufacturer,
    string Region,
    string? Description,
    decimal BasePrice,
    string Currency,
    int LeadTimeDays,
    int StockAvailable);

public sealed record CreateRfqItemRequest(
    Guid ProductId,
    int Quantity,
    decimal RequestedPrice);

public sealed record CreateRfqRequest(
    Guid CustomerId,
    Guid CreatedBy,
    DateOnly DesiredDeliveryDate,
    string? Notes,
    IReadOnlyCollection<CreateRfqItemRequest> Items);

public sealed record ApprovalDecisionRequest(
    Guid ApprovedBy,
    string Comment);

public sealed record SendOfferRequest(
    string RecipientEmail,
    string Channel);

public sealed record CatalogQueryRequest(
    string? Search,
    string? Category,
    string? Manufacturer,
    string? Region,
    bool InStockOnly,
    int Page = 1,
    int PageSize = 24);

public sealed record ImportCatalogItemRequest(
    string Sku,
    string Name,
    string Category,
    string Manufacturer,
    string Region,
    string? Description,
    decimal BasePrice,
    string Currency,
    int LeadTimeDays,
    int StockAvailable);

public sealed record ImportCatalogRequest(
    string SourceName,
    IReadOnlyCollection<ImportCatalogItemRequest> Items);
