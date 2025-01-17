
using System.Diagnostics;

namespace Contenomy.API.Services.Background
{
	public abstract class BackgroundServiceBase<TService> : BackgroundService where TService : BackgroundServiceBase<TService>
	{
		private readonly TimeSpan _cycleTime;
		private readonly IServiceScopeFactory _scopeFactory;


		protected readonly ILogger<TService> _logger;

		private IServiceScope? _currentScope;

		protected BackgroundServiceBase(IServiceScopeFactory scopeFactory, ILogger<TService> logger, TimeSpan cycleTime)
		{
			_logger = logger;
			_scopeFactory = scopeFactory;
			_cycleTime = cycleTime;
		}

		protected sealed override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				var sp = Stopwatch.StartNew();
				OpenScope();
				try
				{
					await Work(stoppingToken);
				}
				catch (Exception e)
				{
					_logger.LogError(e, "Work");
				}
				finally
				{
					sp.Stop();
					CloseScope();

					var toWait = _cycleTime - sp.Elapsed;

					if (toWait <= TimeSpan.Zero)
					{
						toWait = TimeSpan.FromMilliseconds(10);
					}

					await Task.Delay(toWait, stoppingToken);
				}
			}
			CloseScope();
		}

		protected abstract Task Work(CancellationToken cancellationToken);

		private void OpenScope()
		{
			_currentScope = _scopeFactory.CreateScope();
		}

		protected T GetService<T>() where T : class
		{
			if (_currentScope == null)
			{
				throw new InvalidOperationException("Current scope cannot be null");
			}

			return _currentScope.ServiceProvider.GetRequiredService<T>();
		}

		private void CloseScope()
		{
			_currentScope?.Dispose();
			_currentScope = null;
		}
	}
}
