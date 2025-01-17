using Contenomy.API.Models.DTO;
using Contenomy.Data;
using Contenomy.Data.Influx;
using Contenomy.Data.Influx.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.API.Controllers
{
	[ApiController]
    [Route("api/[controller]")]
    public class PriceHistoryController : ControllerBase
    {
        private readonly ContenomyDbContext _context;
        private readonly InfluxService _influx;

        public PriceHistoryController(ContenomyDbContext context, InfluxService influx)
        {
            _context = context;
            _influx = influx;
        }

        [HttpGet("{creatorId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<PriceHistoryDTO>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPriceHistory(int creatorId, [FromQuery] string timeRange)
        {
            var priceHistory = await _context.PriceHistories
                .Where(ph => ph.CreatorAssetId == creatorId)
                .OrderByDescending(ph => ph.Timestamp)
                .Take(GetDataPointsForTimeRange(timeRange))
                .Select(ph => new PriceHistoryDTO
                {
                    Price = ph.Price,
                    Timestamp = ph.Timestamp
                })
                .ToListAsync();

            /* TIP: se hai una lista (ICollection) o un array, usare sempre rispettivamente Count o Length.
             * Any esegue codice e potrebbe essere rallentare l'esecuzione. Usarlo solo se ci sono delle condizioni
             * (tipo Any(f => f.Enabled))
             */
            if (priceHistory.Count <= 0)
            {
                return NotFound();
            }

            return Ok(priceHistory);
        }


        [HttpGet("trend/{creatorId}")]
        public async Task<IActionResult> GetTrend(string creatorId, [FromQuery] Periods period)
        {
            return Ok(await _influx.ReadTrend(creatorId, period));
        }

        private int GetDataPointsForTimeRange(string timeRange)
        {
            return timeRange switch
            {
                "1D" => 24,  // 24 punti per un giorno
                "1W" => 7 * 24,  // 168 punti per una settimana
                "1M" => 30 * 24,  // 720 punti per un mese
                "1Y" => 365,  // 365 punti per un anno
                _ => 100,  // valore di default
            };
        }
    }
}