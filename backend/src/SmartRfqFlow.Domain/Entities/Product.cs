using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class Product : Entity
{
    public required string Sku { get; init; }
    public required string Name { get; init; }
    public required string Category { get; init; }
    public required string Manufacturer { get; init; }
    public required string Region { get; init; }
    public string? Description { get; init; }
    public decimal BasePrice { get; init; }
    public required string Currency { get; init; }
    public int LeadTimeDays { get; init; }
    public int StockAvailable { get; init; }
}
