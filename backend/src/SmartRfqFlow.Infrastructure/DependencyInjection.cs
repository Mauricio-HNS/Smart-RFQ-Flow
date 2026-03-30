using Microsoft.Extensions.DependencyInjection;
using SmartRfqFlow.Application.Abstractions;
using SmartRfqFlow.Infrastructure.Persistence;

namespace SmartRfqFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<ISmartRfqRepository, InMemorySmartRfqRepository>();
        return services;
    }
}
