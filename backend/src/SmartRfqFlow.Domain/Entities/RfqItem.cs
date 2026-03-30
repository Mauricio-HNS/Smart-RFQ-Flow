using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class RfqItem : Entity
{
    public Guid ProductId { get; init; }
    public required string ProductName { get; init; }
    public required string ProductSku { get; init; }
    public int Quantity { get; init; }
    public decimal RequestedPrice { get; init; }
    public decimal? FinalPrice { get; private set; }

    public void ApplyFinalPrice(decimal finalPrice)
    {
        if (finalPrice <= 0)
        {
            throw new InvalidOperationException("Final price must be greater than zero.");
        }

        FinalPrice = finalPrice;
    }
}
