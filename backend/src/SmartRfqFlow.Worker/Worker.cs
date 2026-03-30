namespace SmartRfqFlow.Worker;

public class Worker(ILogger<Worker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            logger.LogInformation("Processing asynchronous RFQ events at {time}", DateTimeOffset.UtcNow);
            await Task.Delay(5000, stoppingToken);
        }
    }
}
