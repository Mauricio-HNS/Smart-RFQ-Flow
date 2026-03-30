using Microsoft.Extensions.DependencyInjection;
using SmartRfqFlow.Application.Services;

namespace SmartRfqFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddSingleton<SmartRfqService>();
        return services;
    }
}
