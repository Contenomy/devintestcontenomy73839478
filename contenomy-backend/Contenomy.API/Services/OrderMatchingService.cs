using Contenomy.Data;
using Contenomy.Data.Entities;
using Contenomy.Data.Enums;
using Contenomy.Data.Influx;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contenomy.API.Services
{
    public class OrderMatchingService
    {
        private readonly ContenomyDbContext _context;
        private readonly ILogger<OrderMatchingService> _logger;
        private readonly WalletService _walletService;
        private readonly InfluxService _influx;

        public OrderMatchingService(ContenomyDbContext context, ILogger<OrderMatchingService> logger, WalletService walletService, InfluxService influx)
        {
            _context = context;
            _logger = logger;
            _walletService = walletService;
            _influx = influx;
        }

        // Modifica: Metodo aggiornato per accettare due argomenti: buyOrder e matchedSellOrders
        public async Task MatchOrdersAsync(Order buyOrder, List<Order> matchedSellOrders)
        {
            foreach (var sellOrder in matchedSellOrders)
            {
                if (buyOrder.Quantity == 0)
                    break;

                var tradeQuantity = Math.Min(buyOrder.Quantity, sellOrder.Quantity);
                var tradePrice = sellOrder.Price;

                // TODO: Add transaction
                var transaction = new Transaction
                {
                    Issuer = buyOrder.UserId,
                    Beneficiary = sellOrder.UserId,
                    Amount = decimal.ToDouble(tradeQuantity * tradePrice),
                    /* TODO: rivedere tipi, stati e campi transazione */
                    Type = TransactionType.Purchase,
                    Status = TransactionStatus.Processing,
                    CreatorAssetId = buyOrder.CreatorAssetId,
                };
                
                _context.Transactions.Add(transaction);

                // Aggiorna gli ordini
                buyOrder.Quantity -= tradeQuantity;
                sellOrder.Quantity -= tradeQuantity;

                if (buyOrder.Quantity == 0)
                    buyOrder.Status = OrderStatus.Executed;
                if (sellOrder.Quantity == 0)
                    sellOrder.Status = OrderStatus.Executed;

                // Aggiorna i wallet
                await _walletService.UpdateWalletForTradeAsync(buyOrder.UserId, sellOrder.UserId, buyOrder.CreatorAssetId, tradeQuantity, tradePrice);

                // Aggiorna il prezzo corrente del CreatorAsset
                var creatorAsset = await _context.CreatorAssets.FindAsync(buyOrder.CreatorAssetId);
                if (creatorAsset != null)
                {
                    creatorAsset.CurrentValue = tradePrice;
                    _context.PriceHistories.Add(new PriceHistory
                    {
                        CreatorAssetId = creatorAsset.Id,
                        Price = tradePrice,
                        Timestamp = DateTime.UtcNow
                    });

                    _influx.WriteNewShareValue(decimal.ToDouble(tradePrice), creatorAsset.CreatorId);
                }

                /* TIP: In linea di massima può andare bene se prendi sempre il context tramite Dependency Injection,
                 * ma occhio che ogni context ha il suo tracciatore delle modifiche: se fai cambiamenti ad entità a DB
                 * presi tramite altri context, il SaveChangesAsync seguente potrebbe non salvare nulla (mi riferisco a buyOrder e sellOrder)
                 */
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Trade executed: {tradeQuantity} shares at {tradePrice:C}. Buyer: {buyOrder.UserId}, Seller: {sellOrder.UserId}");
            }
        }
    }
}
