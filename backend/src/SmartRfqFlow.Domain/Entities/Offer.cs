using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class Offer : Entity
{
    public Guid RfqId { get; init; }
    public int Version { get; init; } = 1;
    public decimal TotalAmount { get; init; }
    public required string Currency { get; init; }
    public DateTimeOffset GeneratedAt { get; init; }
    public DateTimeOffset? SentAt { get; private set; }

    public void MarkAsSent(DateTimeOffset sentAt)
    {
        SentAt = sentAt;
    }
}
