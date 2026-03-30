using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class Approval : Entity
{
    public Guid RfqId { get; init; }
    public Guid ApprovedBy { get; init; }
    public required string Decision { get; init; }
    public required string Comment { get; init; }
    public DateTimeOffset DecisionDate { get; init; }
}
