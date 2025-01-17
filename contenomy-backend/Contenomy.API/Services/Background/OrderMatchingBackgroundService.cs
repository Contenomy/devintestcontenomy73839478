using Contenomy.API.Services;
using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Contenomy.API.Services.Background
{
	public class OrderMatchingBackgroundService : BackgroundServiceBase<OrderMatchingBackgroundService>
	{
		public OrderMatchingBackgroundService(
			IServiceScopeFactory scopeFactory,
			ILogger<OrderMatchingBackgroundService> logger)
			: base(scopeFactory, logger, TimeSpan.FromSeconds(5))
		{
		}

		protected override async Task Work(CancellationToken stoppingToken)
		{
			await MatchPendingOrders(stoppingToken);
		}

		private async Task MatchPendingOrders(CancellationToken stoppingToken)
		{
			var dbContext = GetService<ContenomyDbContext>();
			var orderMatchingService = GetService<OrderMatchingService>();

			// Ottiene tutti i CreatorAsset attivi
			var creatorAssets = await dbContext.CreatorAssets
				.Where(ca => ca.Status == CreatorAssetStatus.Active)
				.ToListAsync(stoppingToken);

			foreach (var creatorAsset in creatorAssets)
			{
				// Ottiene gli ordini di acquisto e vendita pendenti per ogni CreatorAsset
				var pendingBuyOrders = await GetPendingOrders(dbContext, creatorAsset.Id, OrderDirection.Buy, stoppingToken);
				var pendingSellOrders = await GetPendingOrders(dbContext, creatorAsset.Id, OrderDirection.Sell, stoppingToken);

				if (!pendingBuyOrders.Any() || !pendingSellOrders.Any())
				{
					continue;
				}

				// Esegue il matching per ogni ordine di acquisto
				foreach (var buyOrder in pendingBuyOrders.ToList())
				{
					bool matchFound = await MatchOrder(orderMatchingService, buyOrder, pendingSellOrders, creatorAsset, dbContext);
					if (matchFound)
					{
						pendingBuyOrders.Remove(buyOrder);
					}
				}
			}
		}

		private async Task<List<Order>> GetPendingOrders(ContenomyDbContext dbContext, int creatorAssetId, OrderDirection direction, CancellationToken stoppingToken)
		{
			return await dbContext.Orders
				.Where(o => o.CreatorAssetId == creatorAssetId &&
							o.Status == OrderStatus.Pending &&
							o.Direction == direction)
				.OrderBy(o => direction == OrderDirection.Buy ? -o.Price : o.Price)
				.ThenBy(o => o.CreatedAt)
				.ToListAsync(stoppingToken);
		}

		private async Task<bool> MatchOrder(OrderMatchingService orderMatchingService, Order buyOrder, List<Order> sellOrders, CreatorAsset creatorAsset, ContenomyDbContext dbContext)
		{
			var matchedSellOrder = sellOrders.FirstOrDefault(so => so.Price <= buyOrder.Price);
			if (matchedSellOrder != null)
			{
				// Esegui il matching
				await orderMatchingService.MatchOrdersAsync(buyOrder, new List<Order> { matchedSellOrder });

				// Aggiorna il CurrentValue del CreatorAsset
				creatorAsset.CurrentValue = matchedSellOrder.Price;

				// Rimuovi gli ordini matchati
				//dbContext.Orders.Remove(buyOrder);
				//dbContext.Orders.Remove(matchedSellOrder);
				sellOrders.Remove(matchedSellOrder);

				// Salva le modifiche
				await dbContext.SaveChangesAsync();

				_logger.LogInformation($"Match trovato: Ordine di acquisto {buyOrder.Id} con ordine di vendita {matchedSellOrder.Id}. Nuovo CurrentValue: {creatorAsset.CurrentValue}");

				return true;
			}

			return false;
		}
	}
}

/*
Questo servizio in background esegue il matching degli ordini per la piattaforma Contenomy.
Funziona nel seguente modo:
1. Ogni 5 secondi, verifica tutti i CreatorAsset attivi.
2. Per ogni CreatorAsset, recupera gli ordini di acquisto e vendita pendenti.
3. Ordina gli ordini per prezzo (decrescente per acquisti, crescente per vendite) e poi per data.
4. Tenta di abbinare ogni ordine di acquisto con un ordine di vendita compatibile.
5. Quando trova un match, esegue la transazione, aggiorna il CurrentValue del CreatorAsset e rimuove entrambi gli ordini matchati.
6. Il processo continua finché non viene richiesto l'arresto del servizio.

Nota: Questo servizio si occupa solo del matching degli ordini. L'aggiornamento dei portafogli
degli utenti e la gestione della scadenza degli ordini sono gestiti in altri servizi.
*/