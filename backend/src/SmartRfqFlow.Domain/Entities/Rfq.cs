using SmartRfqFlow.Domain.Common;
using SmartRfqFlow.Domain.Enums;

namespace SmartRfqFlow.Domain.Entities;

public sealed class Rfq : Entity
{
    private readonly List<RfqItem> _items = [];

    public required string Number { get; init; }
    public Guid CustomerId { get; init; }
    public required string CustomerName { get; init; }
    public Guid CreatedBy { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    public DateOnly DesiredDeliveryDate { get; init; }
    public string? Notes { get; init; }
    public RfqStatus Status { get; private set; } = RfqStatus.Draft;
    public IReadOnlyCollection<RfqItem> Items => _items.AsReadOnly();

    public void AddItem(RfqItem item)
    {
        // This guard keeps bad payloads from reaching later pricing and offer calculations.
        if (item.Quantity <= 0)
        {
            throw new InvalidOperationException("RFQ item quantity must be greater than zero.");
        }

        _items.Add(item);
    }

    public void Submit()
    {
        // The workflow starts only after at least one commercial line exists.
        if (_items.Count == 0)
        {
            throw new InvalidOperationException("RFQ cannot be submitted without items.");
        }

        if (Status != RfqStatus.Draft)
        {
            throw new InvalidOperationException("Only draft RFQs can be submitted.");
        }

        Status = RfqStatus.Submitted;
    }

    public void MoveToPricing()
    {
        EnsureStatus(RfqStatus.Submitted, RfqStatus.UnderReview);
        Status = RfqStatus.WaitingPricing;
    }

    public void MoveToApproval()
    {
        EnsureStatus(RfqStatus.WaitingPricing);
        Status = RfqStatus.WaitingApproval;
    }

    public void Approve()
    {
        EnsureStatus(RfqStatus.WaitingApproval);
        Status = RfqStatus.Approved;
    }

    public void Reject()
    {
        EnsureStatus(RfqStatus.WaitingApproval);
        Status = RfqStatus.Rejected;
    }

    public void MarkOfferGenerated()
    {
        EnsureStatus(RfqStatus.Approved);
        Status = RfqStatus.OfferGenerated;
    }

    public void MarkAsSent()
    {
        EnsureStatus(RfqStatus.OfferGenerated);
        Status = RfqStatus.SentToCustomer;
    }

    private void EnsureStatus(params RfqStatus[] allowed)
    {
        if (!allowed.Contains(Status))
        {
            throw new InvalidOperationException($"RFQ status transition is invalid from {Status}.");
        }
    }
}
