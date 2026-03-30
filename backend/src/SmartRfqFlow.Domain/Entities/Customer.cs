using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class Customer : Entity
{
    public required string Name { get; init; }
    public required string Country { get; init; }
    public required string Segment { get; init; }
    public required string ContactEmail { get; init; }
}
