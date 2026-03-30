namespace SmartRfqFlow.Application.Contracts;

public sealed record DashboardOverviewResponse(
    int TotalRfqs,
    int PendingApprovals,
    int ApprovedRfqs,
    int RejectedRfqs,
    decimal TotalOfferAmount,
    double AverageApprovalLeadTimeHours);

public sealed record RfqStatusBreakdownResponse(
    string Status,
    int Count);

public sealed record ProcessingTimeResponse(
    string Stage,
    double AverageHours);

public sealed record CatalogProductResponse(
    Guid Id,
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

public sealed record CatalogSearchResponse(
    IReadOnlyCollection<CatalogProductResponse> Items,
    int TotalItems,
    int Page,
    int PageSize,
    IReadOnlyCollection<string> Categories,
    IReadOnlyCollection<string> Manufacturers,
    IReadOnlyCollection<string> Regions);
