using Contenomy.Data;
using Contenomy.Data.Entities;
using Contenomy.Data.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.API.Controllers
{
	[Authorize]
    [ApiController]
    [Route("/[controller]/[action]")]
    public class WalletController : ControllerBase
    {
        private readonly ContenomyDbContext _context;
        private readonly UserManager<ContenomyUser> _userManager;

        public WalletController(ContenomyDbContext context, UserManager<ContenomyUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetWalletEntries()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var userId = user.Id;

            // Recupera le voci del wallet dell'utente con cast esplicito a double
            var entries = await _context.WalletEntries
                .Where(e => e.Wallet.UserId == userId)
                .Select(e => new
                {
                    e.Id,
                    e.Quantity,
                    AveragePrice = (double)e.AveragePrice, // Cast esplicito a double
                    CreatorNickname = e.CreatorAsset.Creator.Nickname
                })
                .ToListAsync();

            return Ok(entries);
        }

        [HttpPost]
        public async Task<IActionResult> InsertSell([FromBody] SellDataDTO sellData)
        {
            if (sellData == null)
            {
                return BadRequest("No data specified");
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var userId = user.Id;

            // Trova la voce del wallet corrispondente per l'utente
            var entry = await _context.WalletEntries
                .Where(e => e.Wallet.UserId == userId)
                .FirstOrDefaultAsync(e => e.Id == sellData.WalletEntryId);

            if (entry == null)
            {
                return NotFound("Wallet entry not found");
            }

            try
            {
                // Cast esplicito a double per evitare l'errore di conversione
                var amount = sellData.Amount * (double)(sellData.SellPrice ?? entry.AveragePrice);

                // Creazione della transazione di vendita
                var transaction = new Transaction
                {
                    Amount = amount,
                    CreatorAssetId = entry.CreatorAssetId,
                    Issuer = userId,
                    WalletEntryId = entry.Id,
                    Status = TransactionStatus.Accepted,
                    Type = TransactionType.Sell,
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Registra l'errore della transazione
                await _context.InsertTransactionErrorAsync(null, null, ex.Message, ex, true);
                throw;
            }

            return Ok();
        }
    }

    /* Q&A: l'hai aggiunto tu? C'è già nella cartella DTO */
    // DTO per i dati della vendita
    public class SellDataDTO
    {
        public int WalletEntryId { get; set; }
        public int Amount { get; set; }
        public decimal? SellPrice { get; set; }
    }
}
