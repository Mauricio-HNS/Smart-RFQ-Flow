using SmartRfqFlow.Domain.Entities;

namespace SmartRfqFlow.Application.Abstractions;

public interface ISmartRfqRepository
{
    IReadOnlyCollection<User> GetUsers();
    IReadOnlyCollection<Customer> GetCustomers();
    IReadOnlyCollection<Product> GetProducts();
    IReadOnlyCollection<Rfq> GetRfqs();
    IReadOnlyCollection<Offer> GetOffers();
    IReadOnlyCollection<AuditLog> GetAuditLogs();
    IReadOnlyCollection<Approval> GetApprovals();
    IReadOnlyCollection<IntegrationLog> GetIntegrationLogs();
    IReadOnlyCollection<ProcessedMessage> GetProcessedMessages();

    User? FindUser(Guid id);
    Customer? FindCustomer(Guid id);
    Product? FindProduct(Guid id);
    Rfq? FindRfq(Guid id);
    Offer? FindOffer(Guid id);

    Customer AddCustomer(Customer customer);
    Product AddProduct(Product product);
    Rfq AddRfq(Rfq rfq);
    Approval AddApproval(Approval approval);
    Offer AddOffer(Offer offer);
    AuditLog AddAuditLog(AuditLog auditLog);
    IntegrationLog AddIntegrationLog(IntegrationLog integrationLog);
    ProcessedMessage AddProcessedMessage(ProcessedMessage processedMessage);
}
