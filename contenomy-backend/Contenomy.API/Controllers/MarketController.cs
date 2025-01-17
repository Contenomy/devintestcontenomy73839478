using Contenomy.API.Models.DTO;
using Contenomy.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.API.Controllers
{
	[ApiController]
    [Route("api/[controller]")]
    public class MarketController : ControllerBase
    {
        private readonly ContenomyDbContext _context;
        private readonly ILogger<MarketController> _logger;

        public MarketController(ContenomyDbContext context, ILogger<MarketController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("GetMarketShares")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<MarketShareDTO>))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMarketShares()
        {
            try
            {
                var res = await _context.CreatorAssets
                    .Select(asset => new MarketShareDTO
                    {
                        Id = asset.Id,
                        MarketCap = (double)(asset.TotalQuantity * asset.CurrentValue),
                        Price = (double)asset.CurrentValue,
                        Name = !string.IsNullOrEmpty(asset.Creator.Nickname) ? asset.Creator.Nickname : asset.Creator.UserName ?? "Unknown",
                        Trend = CalculateTrend(asset.Id)
                    })
                    .ToListAsync();

                return Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante il recupero delle quote di mercato");
                return StatusCode(500, "Si è verificato un errore durante il recupero delle quote di mercato");
            }
        }

        [HttpGet("GetMarketShare/{shareID}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MarketShareDTO))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMarketShare([FromRoute] int shareID)
        {
            try
            {
                var share = await _context.CreatorAssets
                    .Where(asset => asset.Id == shareID)
                    .Select(asset => new MarketShareDTO
                    {
                        Id = asset.Id,
                        MarketCap = (double)(asset.TotalQuantity * asset.CurrentValue), // Cast esplicito a double
                        Price = (double)asset.CurrentValue, // Cast esplicito a double
                        Name = !string.IsNullOrEmpty(asset.Creator.Nickname) ? asset.Creator.Nickname : asset.Creator.UserName ?? "Unknown",
                        Trend = CalculateTrend(asset.Id)
                    })
                    .FirstOrDefaultAsync();

                if (share == null)
                {
                    return NotFound($"Quota di mercato con ID {shareID} non trovata");
                }

                return Ok(share);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante il recupero della quota di mercato con ID {shareID}", shareID);
                return StatusCode(500, $"Si è verificato un errore durante il recupero della quota di mercato con ID {shareID}");
            }
        }

        private double CalculateTrend(int assetId)
        {
            var latestPrices = _context.PriceHistories
                .Where(ph => ph.CreatorAssetId == assetId)
                .OrderByDescending(ph => ph.Timestamp)
                .Take(2)
                .ToList();

            if (latestPrices.Count < 2)
            {
                return 0;
            }

            var latestPrice = (double)latestPrices[0].Price; // Cast esplicito a double
            var previousPrice = (double)latestPrices[1].Price; // Cast esplicito a double

            return (latestPrice - previousPrice) / previousPrice * 100;
        }
    }
}

/*
Questo controller gestisce le richieste per ottenere informazioni di mercato sui CreatorAsset.
Include metodi per ottenere un elenco di asset di mercato e per calcolare il trend del prezzo di un asset.
Le conversioni esplicite a double sono state aggiunte per evitare errori di tipo durante le operazioni.
*/
