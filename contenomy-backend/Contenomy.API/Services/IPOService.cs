using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Contenomy.API.Services
{
    public class IPOService
    {
        private readonly ContenomyDbContext _context;
        private readonly CreatorAssetService _creatorAssetService; // Modificato da SupportShareService a CreatorAssetService

        public IPOService(ContenomyDbContext context, CreatorAssetService creatorAssetService) // Aggiornato parametro del costruttore
        {
            _context = context;
            _creatorAssetService = creatorAssetService; // Aggiornato a CreatorAssetService
        }

        public async Task<IPO> CreateIPOAsync(string creatorId, decimal initialPrice, DateTime startDate)
        {
            // Usa CreatorAssetService per creare un nuovo CreatorAsset
            var creatorAsset = await _creatorAssetService.CreateCreatorAssetAsync(creatorId, 1000, initialPrice);

            var ipo = new IPO
            {
                CreatorId = creatorId,
                CreatorAssetId = creatorAsset.Id,
                StartDate = startDate,
                InitialQuantity = 1000,
                InitialPrice = initialPrice,
                Status = IPOStatus.Pending
            };

            _context.IPOs.Add(ipo);
            await _context.SaveChangesAsync();
            return ipo;
        }

        public async Task<IPO?> GetIPOAsync(int ipoId)
        {
            return await _context.IPOs
                .Include(i => i.CreatorAsset)
                .FirstOrDefaultAsync(i => i.Id == ipoId);
        }

        public async Task ActivateIPOAsync(int ipoId)
        {
            var ipo = await _context.IPOs.FindAsync(ipoId);
            if (ipo != null && ipo.Status == IPOStatus.Pending)
            {
                ipo.Status = IPOStatus.Active;
                await _context.SaveChangesAsync();

                // Qui potresti aggiungere logica per creare un ordine di vendita iniziale
                // utilizzando OrderBookService o un altro servizio appropriato
            }
        }

        public async Task CompleteIPOAsync(int ipoId) // Probabilmente questa è da eliminare, perchè la IPO è sempre completa, nel senso che è subito sul mercato secondario
        {
            var ipo = await _context.IPOs.FindAsync(ipoId);
            if (ipo != null && ipo.Status == IPOStatus.Active)
            {
                ipo.Status = IPOStatus.Completed;
                await _context.SaveChangesAsync();
            }
        }
    }
}

/*
Questo servizio gestisce le operazioni relative alle Offerte Pubbliche Iniziali (IPO) nella piattaforma Contenomy.
Fornisce metodi per creare nuove IPO, recuperare informazioni su IPO esistenti, attivare IPO pendenti
e completare IPO attive. Utilizza CreatorAssetService per creare i CreatorAsset associati alle IPO
e interagisce con il database attraverso ContenomyDbContext.
*/
