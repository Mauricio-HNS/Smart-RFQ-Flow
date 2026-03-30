namespace SmartRfqFlow.Application.Contracts;

public sealed record DashboardOverviewResponse(
    int TotalRfqs,
    int PendingApprovals,
    int ApprovedRfqs,
    int RejectedRfqs,
    decimal TotalOfferAmount,
    double AverageApprovalLeadTimeHours);

public sealed record RfqStatusBreakdownResponse(
    string Status,
    int Count);

public sealed record ProcessingTimeResponse(
    string Stage,
    double AverageHours);
