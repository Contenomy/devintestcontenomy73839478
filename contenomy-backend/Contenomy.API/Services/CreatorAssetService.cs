using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.API.Services
{
	public class CreatorAssetService
    {
        private readonly ContenomyDbContext _context;

        public CreatorAssetService(ContenomyDbContext context)
        {
            _context = context;
        }

        public async Task<CreatorAsset> CreateCreatorAssetAsync(string creatorId, int totalQuantity, decimal initialValue)
        {
            var creatorAsset = new CreatorAsset
            {
                CreatorId = creatorId,
                TotalQuantity = totalQuantity,
                AvailableQuantity = totalQuantity,
                CurrentValue = initialValue,
                StartDate = DateTime.UtcNow,
                Status = CreatorAssetStatus.Active
            };

            _context.CreatorAssets.Add(creatorAsset);
            await _context.SaveChangesAsync();
            return creatorAsset;
        }

        public async Task<CreatorAsset?> GetCreatorAssetAsync(int creatorAssetId)
        {
            return await _context.CreatorAssets.FindAsync(creatorAssetId);
        }

        public async Task UpdateCreatorAssetValueAsync(int creatorAssetId, decimal newValue)
        {
            var creatorAsset = await _context.CreatorAssets.FindAsync(creatorAssetId);
            if (creatorAsset != null)
            {
                creatorAsset.CurrentValue = newValue;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<CreatorAsset>> GetAllActiveCreatorAssetsAsync()
        {
            return await _context.CreatorAssets
                .Where(ca => ca.Status == CreatorAssetStatus.Active)
                .ToListAsync();
        }
    }
}

/*
Questo servizio gestisce le operazioni relative ai CreatorAsset nella piattaforma Contenomy.
Fornisce metodi per creare nuovi CreatorAsset, recuperare informazioni su CreatorAsset esistenti,
aggiornare il valore dei CreatorAsset e ottenere un elenco di tutti i CreatorAsset attivi.
Utilizza Entity Framework Core per interagire con il database attraverso ContenomyDbContext.
*/
