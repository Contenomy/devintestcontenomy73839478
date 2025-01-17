using Contenomy.API.Models.DTO;
using Contenomy.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Contenomy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IPOController : ControllerBase
    {
        private readonly IPOService _ipoService;

        // Costruttore che inietta IPOService
        public IPOController(IPOService ipoService)
        {
            _ipoService = ipoService;
        }

        // POST: api/IPO
        // Crea una nuova IPO (Initial Public Offering)
        [HttpPost]
        [Authorize(Roles = "Admin")] // Solo gli admin possono creare IPO
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(IPODTO))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateIPO([FromBody] CreateIPODTO createDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Crea una nuova IPO utilizzando il servizio
            var ipo = await _ipoService.CreateIPOAsync(createDTO.CreatorId, createDTO.InitialPrice, createDTO.StartDate);

            // Mappa l'IPO creata in un DTO
            var ipoDTO = new IPODTO
            {
                Id = ipo.Id,
                CreatorId = ipo.CreatorId,
                CreatorAssetId = ipo.CreatorAssetId,
                StartDate = ipo.StartDate,
                InitialQuantity = ipo.InitialQuantity,
                InitialPrice = ipo.InitialPrice,
                Status = ipo.Status.ToString()
            };

            // Restituisce una risposta 201 Created con l'IPO creata
            return CreatedAtAction(nameof(GetIPO), new { id = ipo.Id }, ipoDTO);
        }

        // GET: api/IPO/{id}
        // Recupera i dettagli di una specifica IPO
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IPODTO))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetIPO(int id)
        {
            var ipo = await _ipoService.GetIPOAsync(id);
            if (ipo == null)
            {
                return NotFound();
            }

            // Mappa l'IPO in un DTO
            var ipoDTO = new IPODTO
            {
                Id = ipo.Id,
                CreatorId = ipo.CreatorId,
                CreatorAssetId = ipo.CreatorAssetId,
                StartDate = ipo.StartDate,
                InitialQuantity = ipo.InitialQuantity,
                InitialPrice = ipo.InitialPrice,
                Status = ipo.Status.ToString()
            };

            return Ok(ipoDTO);
        }

        // POST: api/IPO/{id}/activate
        // Attiva una IPO esistente
        [HttpPost("{id}/activate")]
        [Authorize(Roles = "Admin")] // Solo gli admin possono attivare IPO
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActivateIPO(int id)
        {
            var ipo = await _ipoService.GetIPOAsync(id);
            if (ipo == null)
            {
                return NotFound();
            }

            await _ipoService.ActivateIPOAsync(id);
            return NoContent();
        }

        // POST: api/IPO/{id}/complete
        // Completa una IPO esistente
        [HttpPost("{id}/complete")]
        [Authorize(Roles = "Admin")] // Solo gli admin possono completare IPO
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CompleteIPO(int id)
        {
            var ipo = await _ipoService.GetIPOAsync(id);
            if (ipo == null)
            {
                return NotFound();
            }

            await _ipoService.CompleteIPOAsync(id);
            return NoContent();
        }
    }
}

// Questo controller gestisce le operazioni relative alle IPO (Initial Public Offerings).
// Fornisce endpoint per creare, recuperare, attivare e completare le IPO.
// Implementa l'autorizzazione per garantire che solo gli amministratori possano eseguire operazioni sensibili.
// Utilizza DTO per la comunicazione con i client, mappando le entità del dominio in oggetti di trasferimento dati.