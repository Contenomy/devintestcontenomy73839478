using Contenomy.API.Models.DTO;
using Contenomy.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Contenomy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreatorAssetController : ControllerBase
    {
        private readonly CreatorAssetService _creatorAssetService;

        // Constructor injection del CreatorAssetService
        public CreatorAssetController(CreatorAssetService creatorAssetService)
        {
            _creatorAssetService = creatorAssetService;
        }

        // GET: api/CreatorAsset
        // Recupera tutti i CreatorAsset attivi
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CreatorAssetDTO>))]
        public async Task<IActionResult> GetAllActiveCreatorAssets()
        {
            var creatorAssets = await _creatorAssetService.GetAllActiveCreatorAssetsAsync();
            // Mappiamo i CreatorAsset in CreatorAssetDTO
            var creatorAssetDTOs = creatorAssets.Select(ca => new CreatorAssetDTO
            {
                Id = ca.Id,
                CreatorId = ca.CreatorId,
                TotalQuantity = ca.TotalQuantity,
                AvailableQuantity = ca.AvailableQuantity,
                CurrentValue = ca.CurrentValue,
                StartDate = ca.StartDate,
                Status = ca.Status.ToString()
            });

            return Ok(creatorAssetDTOs);
        }

        // GET: api/CreatorAsset/{id}
        // Recupera un CreatorAsset specifico per ID
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CreatorAssetDTO))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCreatorAsset(int id)
        {
            var creatorAsset = await _creatorAssetService.GetCreatorAssetAsync(id);
            if (creatorAsset == null)
            {
                return NotFound();
            }

            // Mappiamo il CreatorAsset in CreatorAssetDTO
            var creatorAssetDTO = new CreatorAssetDTO
            {
                Id = creatorAsset.Id,
                CreatorId = creatorAsset.CreatorId,
                TotalQuantity = creatorAsset.TotalQuantity,
                AvailableQuantity = creatorAsset.AvailableQuantity,
                CurrentValue = creatorAsset.CurrentValue,
                StartDate = creatorAsset.StartDate,
                Status = creatorAsset.Status.ToString()
            };

            return Ok(creatorAssetDTO);
        }

        // POST: api/CreatorAsset
        // Crea un nuovo CreatorAsset (solo per Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(CreatorAssetDTO))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCreatorAsset([FromBody] CreateCreatorAssetDTO createDTO)
        {
            TryValidateModel(createDTO);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var creatorAsset = await _creatorAssetService.CreateCreatorAssetAsync(createDTO.CreatorId, createDTO.TotalQuantity, createDTO.InitialValue);

            // Mappiamo il nuovo CreatorAsset in CreatorAssetDTO
            var creatorAssetDTO = new CreatorAssetDTO
            {
                Id = creatorAsset.Id,
                CreatorId = creatorAsset.CreatorId,
                TotalQuantity = creatorAsset.TotalQuantity,
                AvailableQuantity = creatorAsset.AvailableQuantity,
                CurrentValue = creatorAsset.CurrentValue,
                StartDate = creatorAsset.StartDate,
                Status = creatorAsset.Status.ToString()
            };

            return CreatedAtAction(nameof(GetCreatorAsset), new { id = creatorAsset.Id }, creatorAssetDTO);
        }

        // PUT: api/CreatorAsset/{id}/value
        // Aggiorna il valore di un CreatorAsset specifico (solo per Admin)
        [HttpPut("{id}/value")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCreatorAssetValue(int id, [FromBody] UpdateValueDTO updateDTO)
        {
            TryValidateModel(updateDTO);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var creatorAsset = await _creatorAssetService.GetCreatorAssetAsync(id);
            if (creatorAsset == null)
            {
                return NotFound();
            }

            await _creatorAssetService.UpdateCreatorAssetValueAsync(id, updateDTO.NewValue);

            return NoContent();
        }
    }
}

// Questo controller gestisce le operazioni CRUD per i CreatorAsset.
// Fornisce endpoints per recuperare, creare e aggiornare i CreatorAsset.
// Implementa autorizzazione per le operazioni di creazione e aggiornamento.
// Utilizza DTO per la comunicazione con i client, mappando le entità del dominio in oggetti di trasferimento dati.