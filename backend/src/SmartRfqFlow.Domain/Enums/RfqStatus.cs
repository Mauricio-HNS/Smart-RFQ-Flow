namespace SmartRfqFlow.Domain.Enums;

public enum RfqStatus
{
    Draft,
    Submitted,
    UnderReview,
    WaitingPricing,
    WaitingApproval,
    Approved,
    Rejected,
    OfferGenerated,
    SentToCustomer,
    Accepted,
    Lost
}
