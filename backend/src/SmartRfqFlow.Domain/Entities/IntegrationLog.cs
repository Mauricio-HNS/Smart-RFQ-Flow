using SmartRfqFlow.Domain.Common;

namespace SmartRfqFlow.Domain.Entities;

public sealed class IntegrationLog : Entity
{
    public required string SourceSystem { get; init; }
    public required string TargetSystem { get; init; }
    public required string Operation { get; init; }
    public required string Status { get; init; }
    public string? RequestPayload { get; init; }
    public string? ResponsePayload { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
