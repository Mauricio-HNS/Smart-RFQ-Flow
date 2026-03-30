using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class AuditLog : Entity
{
    public required string EntityName { get; init; }
    public required string EntityId { get; init; }
    public required string Action { get; init; }
    public required string PerformedBy { get; init; }
    public DateTimeOffset Timestamp { get; init; }
    public string? OldValues { get; init; }
    public string? NewValues { get; init; }
}
