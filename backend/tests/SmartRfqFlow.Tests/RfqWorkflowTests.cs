using FluentAssertions;
using SmartRfqFlow.Domain.Entities;
using SmartRfqFlow.Domain.Enums;

namespace SmartRfqFlow.Tests;

public sealed class RfqWorkflowTests
{
    [Fact]
    public void Submit_ShouldFail_WhenRfqHasNoItems()
    {
        var rfq = new Rfq
        {
            Number = "RFQ-TEST-001",
            CustomerId = Guid.NewGuid(),
            CustomerName = "Test Customer",
            CreatedBy = Guid.NewGuid(),
            CreatedAt = DateTimeOffset.UtcNow,
            DesiredDeliveryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
        };

        var act = rfq.Submit;

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*without items*");
    }

    [Fact]
    public void Approve_ShouldMoveToApproved_WhenWaitingApproval()
    {
        var rfq = new Rfq
        {
            Number = "RFQ-TEST-002",
            CustomerId = Guid.NewGuid(),
            CustomerName = "Test Customer",
            CreatedBy = Guid.NewGuid(),
            CreatedAt = DateTimeOffset.UtcNow,
            DesiredDeliveryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
        };

        rfq.AddItem(new RfqItem
        {
            ProductId = Guid.NewGuid(),
            ProductName = "Sensor",
            ProductSku = "SNS-001",
            Quantity = 2,
            RequestedPrice = 100m
        });

        rfq.Submit();
        rfq.MoveToPricing();
        rfq.MoveToApproval();
        rfq.Approve();

        rfq.Status.Should().Be(RfqStatus.Approved);
    }

    [Fact]
    public void MarkAsSent_ShouldMoveToSentToCustomer_WhenOfferWasGenerated()
    {
        var rfq = new Rfq
        {
            Number = "RFQ-TEST-003",
            CustomerId = Guid.NewGuid(),
            CustomerName = "Test Customer",
            CreatedBy = Guid.NewGuid(),
            CreatedAt = DateTimeOffset.UtcNow,
            DesiredDeliveryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
        };

        rfq.AddItem(new RfqItem
        {
            ProductId = Guid.NewGuid(),
            ProductName = "Sensor",
            ProductSku = "SNS-002",
            Quantity = 3,
            RequestedPrice = 150m
        });

        rfq.Submit();
        rfq.MoveToPricing();
        rfq.MoveToApproval();
        rfq.Approve();
        rfq.MarkOfferGenerated();
        rfq.MarkAsSent();

        rfq.Status.Should().Be(RfqStatus.SentToCustomer);
    }
}
