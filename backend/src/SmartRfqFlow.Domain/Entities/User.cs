using SmartRfqFlow.Domain.Common;
using SmartRfqFlow.Domain.Enums;

namespace SmartRfqFlow.Domain.Entities;

public sealed class User : Entity
{
    public required string Name { get; init; }
    public required string Email { get; init; }
    public UserRole Role { get; init; }
    public bool IsActive { get; init; } = true;
}
