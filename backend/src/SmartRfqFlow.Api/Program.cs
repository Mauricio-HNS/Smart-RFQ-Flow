using SmartRfqFlow.Application;
using SmartRfqFlow.Application.Contracts;
using SmartRfqFlow.Application.Services;
using SmartRfqFlow.Infrastructure;

namespace SmartRfqFlow.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddApplication();
        builder.Services.AddInfrastructure();
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
                policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
        });

        var app = builder.Build();

        app.UseCors();

        app.Use(async (context, next) =>
        {
            try
            {
                await next();
            }
            catch (InvalidOperationException exception)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsJsonAsync(new
                {
                    error = exception.Message
                });
            }
        });

        app.MapGet("/health", () => Results.Ok(new
        {
            status = "Healthy",
            service = "Smart RFQ Flow API",
            utcNow = DateTimeOffset.UtcNow
        }));

        app.MapPost("/api/auth/login", () => Results.Ok(new
        {
            token = "demo-token",
            user = new
            {
                id = "11111111-1111-1111-1111-111111111111",
                name = "Nina Costa",
                role = "SalesRep"
            }
        }));

        app.MapGet("/api/customers", (SmartRfqService service) => Results.Ok(service.GetCustomers()));
        app.MapGet("/api/customers/{id:guid}", (Guid id, SmartRfqService service) => Results.Ok(service.GetCustomer(id)));
        app.MapPost("/api/customers", (CreateCustomerRequest request, SmartRfqService service) => Results.Ok(service.CreateCustomer(request)));

        app.MapGet("/api/products", (SmartRfqService service) => Results.Ok(service.GetProducts()));
        app.MapGet("/api/products/{id:guid}", (Guid id, SmartRfqService service) => Results.Ok(service.GetProduct(id)));
        app.MapPost("/api/products", (CreateProductRequest request, SmartRfqService service) => Results.Ok(service.CreateProduct(request)));
        app.MapGet("/api/catalog/search", (
            [AsParameters] CatalogQueryRequest request,
            SmartRfqService service) => Results.Ok(service.SearchCatalog(request)));

        app.MapGet("/api/rfqs", (SmartRfqService service) => Results.Ok(service.GetRfqs()));
        app.MapGet("/api/rfqs/{id:guid}", (Guid id, SmartRfqService service) => Results.Ok(service.GetRfq(id)));
        app.MapPost("/api/rfqs", (CreateRfqRequest request, SmartRfqService service) => Results.Ok(service.CreateRfq(request)));
        app.MapPost("/api/rfqs/{id:guid}/submit", (Guid id, SmartRfqService service) => Results.Ok(service.SubmitRfq(id)));
        app.MapPost("/api/rfqs/{id:guid}/request-pricing", (Guid id, SmartRfqService service) => Results.Ok(service.RequestPricing(id)));
        app.MapPost("/api/rfqs/{id:guid}/approve", (Guid id, ApprovalDecisionRequest request, SmartRfqService service) => Results.Ok(service.ApproveRfq(id, request)));
        app.MapPost("/api/rfqs/{id:guid}/reject", (Guid id, ApprovalDecisionRequest request, SmartRfqService service) => Results.Ok(service.RejectRfq(id, request)));
        app.MapPost("/api/rfqs/{id:guid}/generate-offer", (Guid id, SmartRfqService service) => Results.Ok(service.GenerateOffer(id)));

        app.MapGet("/api/offers", (SmartRfqService service) => Results.Ok(service.GetOffers()));
        app.MapGet("/api/offers/{id:guid}", (Guid id, SmartRfqService service) => Results.Ok(service.GetOffer(id)));
        app.MapPost("/api/offers/{id:guid}/send", (Guid id, SendOfferRequest request, SmartRfqService service) => Results.Ok(service.SendOffer(id, request)));

        app.MapGet("/api/audit", (SmartRfqService service) => Results.Ok(service.GetAuditLogs()));
        app.MapGet("/api/audit/entity/{entityName}/{entityId}", (string entityName, string entityId, SmartRfqService service) =>
            Results.Ok(service.GetAuditLogs().Where(log => log.EntityName.Equals(entityName, StringComparison.OrdinalIgnoreCase) && log.EntityId == entityId)));

        app.MapGet("/api/analytics/overview", (SmartRfqService service) => Results.Ok(service.GetOverview()));
        app.MapGet("/api/analytics/rfq-status", (SmartRfqService service) => Results.Ok(service.GetRfqStatusBreakdown()));
        app.MapGet("/api/analytics/processing-time", (SmartRfqService service) => Results.Ok(service.GetProcessingTimes()));
        app.MapGet("/api/analytics/conversion", () => Results.Ok(new
        {
            generatedOffers = 4,
            wonDeals = 2,
            conversionRate = 50
        }));

        app.MapGet("/external/salesforce/opportunities/{id}", (string id, SmartRfqService service) => Results.Ok(service.GetSalesforceOpportunity(id)));
        app.MapPost("/external/sap/pricing/{rfqId:guid}", (Guid rfqId, SmartRfqService service) => Results.Ok(service.GetSapPricing(rfqId)));
        app.MapGet("/api/integrations/logs", (SmartRfqService service) => Results.Ok(service.GetIntegrationLogs()));

        app.Run();
    }
}
