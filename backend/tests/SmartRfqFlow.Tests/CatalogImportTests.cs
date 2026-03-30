using FluentAssertions;
using SmartRfqFlow.Application.Contracts;
using SmartRfqFlow.Application.Services;
using SmartRfqFlow.Infrastructure.Persistence;

namespace SmartRfqFlow.Tests;

public sealed class CatalogImportTests
{
    [Fact]
    public void ImportCatalog_ShouldIncreaseProductCount()
    {
        var repository = new InMemorySmartRfqRepository();
        var service = new SmartRfqService(repository);
        var initialCount = repository.GetProducts().Count;

        var response = service.ImportCatalog(new ImportCatalogRequest(
            "SupplierCsv",
            [
                new ImportCatalogItemRequest(
                    "EXT-VAL-90001",
                    "External Valve Cluster",
                    "Valves",
                    "Emerson",
                    "EMEA",
                    "Imported supplier catalog line.",
                    420m,
                    "EUR",
                    12,
                    17)
            ]));

        response.ImportedItems.Should().Be(1);
        response.TotalProductsAfterImport.Should().Be(initialCount + 1);
        repository.GetProducts().Should().Contain(product => product.Sku == "EXT-VAL-90001");
    }
}
