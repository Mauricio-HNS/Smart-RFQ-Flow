using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class Product : Entity
{
    public required string Sku { get; init; }
    public required string Name { get; init; }
    public decimal BasePrice { get; init; }
    public required string Currency { get; init; }
    public int LeadTimeDays { get; init; }
    public int StockAvailable { get; init; }
}
