using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class ProcessedMessage : Entity
{
    public required string MessageId { get; init; }
    public required string CorrelationId { get; init; }
    public required string MessageType { get; init; }
    public DateTimeOffset ProcessedAt { get; init; }
}
