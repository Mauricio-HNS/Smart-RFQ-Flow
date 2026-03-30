using SmartRfqFlow.Worker;
using SmartRfqFlow.Application;
using SmartRfqFlow.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddApplication();
builder.Services.AddInfrastructure();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
