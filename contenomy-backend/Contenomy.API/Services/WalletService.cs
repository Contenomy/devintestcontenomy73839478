using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Contenomy.API.Services
{
    public class WalletService
    {
        private readonly ContenomyDbContext _context;

        public WalletService(ContenomyDbContext context)
        {
            _context = context;
        }

        public async Task<Wallet> GetOrCreateWalletAsync(string userId)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
            if (wallet == null)
            {
                wallet = new Wallet { UserId = userId, AvailableBalance = 0 };
                _context.Wallets.Add(wallet);
                await _context.SaveChangesAsync();
            }
            return wallet;
        }

        public async Task UpdateWalletForTradeAsync(string buyerUserId, string sellerUserId, int creatorAssetId, int quantity, decimal price)
        {
            var totalAmount = quantity * price;

            // Aggiorna il wallet del compratore
            await UpdateWalletEntryAsync(buyerUserId, creatorAssetId, quantity, price);
            await UpdateAvailableBalanceAsync(buyerUserId, -totalAmount);

            // Aggiorna il wallet del venditore
            await UpdateWalletEntryAsync(sellerUserId, creatorAssetId, -quantity, price);
            await UpdateAvailableBalanceAsync(sellerUserId, totalAmount);
        }

        private async Task UpdateWalletEntryAsync(string userId, int creatorAssetId, int quantityChange, decimal price)
        {
            /* FACT: in linea di massima il wallet dovrebbe sempre esserci (bisognerà crearlo alla registrazione), quindi
             * occhio a metodi come questo sotto: Così potrebbe esserci un caso limite dove viene creato un wallet ed un
             * utente ha una entry gratis o che il saldo possa andare in negativo perché appena creato.
             * Ci sono eventualmente da fare i controlli prima o da avere sempre sicuro il wallet
             */
            var wallet = await GetOrCreateWalletAsync(userId);
            /* Q&A: che problemi dovresti avere con WalletEntries? */
            var entry = await _context.Set<WalletEntry>() // Usa Set per evitare problemi con WalletEntries
                .FirstOrDefaultAsync(e => e.WalletId == wallet.Id && e.CreatorAssetId == creatorAssetId);

            if (entry == null)
            {
                entry = new WalletEntry
                {
                    WalletId = wallet.Id,
                    CreatorAssetId = creatorAssetId,
                    Quantity = quantityChange,
                    AveragePrice = price
                };
                _context.Set<WalletEntry>().Add(entry); // Usa Set per aggiungere la nuova entry
            }
            else
            {
                var totalValue = (entry.Quantity * entry.AveragePrice) + (quantityChange * price);
                entry.Quantity += quantityChange;
                entry.AveragePrice = entry.Quantity > 0 ? totalValue / entry.Quantity : 0;
            }

            await _context.SaveChangesAsync();
        }

        private async Task UpdateAvailableBalanceAsync(string userId, decimal amount)
        {
            var wallet = await GetOrCreateWalletAsync(userId);
            wallet.AvailableBalance += amount;
            await _context.SaveChangesAsync();
        }

        public async Task<decimal> GetAvailableBalanceAsync(string userId)
        {
            var wallet = await GetOrCreateWalletAsync(userId);
            return wallet.AvailableBalance;
        }

        public async Task<WalletEntry[]> GetWalletEntriesAsync(string userId)
        {
            var wallet = await GetOrCreateWalletAsync(userId);
            return await _context.Set<WalletEntry>() // Usa Set per ottenere le entry correttamente
                .Where(we => we.WalletId == wallet.Id)
                .ToArrayAsync();
        }
    }
}

/*
Questo servizio gestisce le operazioni relative ai wallet degli utenti nella piattaforma Contenomy.
Fornisce metodi per creare e recuperare wallet, aggiornare i saldi e le entry del wallet durante le transazioni,
e ottenere informazioni sui saldi e sulle entry del wallet di un utente.
*/
