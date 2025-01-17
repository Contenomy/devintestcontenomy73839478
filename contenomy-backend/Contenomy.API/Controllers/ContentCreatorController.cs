using Contenomy.API.Models.DTO;
using Contenomy.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.API.Controllers
{
	[ApiController]
	/* Tip: Di norma meglio mettere anche l'azione nell'URL: [Route("api/[controller]/[action]")] (vedi AuthController) */
	[Route("api/[controller]")]
	public class ContentCreatorController : ControllerBase
	{
		private readonly ContenomyDbContext _context;

		public ContentCreatorController(ContenomyDbContext context)
		{
			_context = context;
		}

		// Metodo per ottenere tutti i content creator
		[HttpGet]
		public async Task<ActionResult<IEnumerable<ContentCreatorInfoDTO>>> GetContentCreatorsInfo()
		{
			var contentCreatorsInfoQuery = _context.Users
				.Include(f => f.CreatorAssets)
				/* Q&A: Non erano uno a uno? */
				.Where(u => u.CreatorAssets.Count > 0)
				.Select(u => new ContentCreatorInfoDTO
				{
					UserId = u.Id,
					Username = u.UserName,
					Nickname = u.Nickname,
					Email = u.Email,
					PhoneNumber = u.PhoneNumber,
					TotalQuantity = u.CreatorAssets.FirstOrDefault().TotalQuantity,
					AvailableQuantity = u.CreatorAssets.FirstOrDefault().AvailableQuantity,
					CurrentValue = u.CreatorAssets.FirstOrDefault().CurrentValue,
					CreatorAssetStartDate = u.CreatorAssets.FirstOrDefault().StartDate,
					CreatorAssetEndDate = u.CreatorAssets.FirstOrDefault().EndDate,
					Description = u.CreatorAssets.FirstOrDefault().Description,
					CreatorAssetStatus = u.CreatorAssets.FirstOrDefault().Status.ToString(),
					IPOStartDate = u.CreatorAssets.FirstOrDefault().IPO != null ? u.CreatorAssets.FirstOrDefault().IPO.StartDate : (DateTime?)null,
					InitialPrice = u.CreatorAssets.FirstOrDefault().IPO != null ? u.CreatorAssets.FirstOrDefault().IPO.InitialPrice : 0,
					IPOStatus = u.CreatorAssets.FirstOrDefault().IPO != null ? u.CreatorAssets.FirstOrDefault().IPO.Status.ToString() : null
				});

				var contentCreatorsInfo = await contentCreatorsInfoQuery
				.ToListAsync();

			return Ok(contentCreatorsInfo);
		}

		// Metodo per ottenere un singolo content creator per ID
		[HttpGet("{id}")]
		public async Task<ActionResult<ContentCreatorInfoDTO>> GetContentCreatorInfo(string id)
		{
			var creator = await _context.Users
				.Where(u => u.Id == id && u.CreatorAssets.Count > 0)
				.Select(u => new ContentCreatorInfoDTO
				{
					UserId = u.Id,
					Username = u.UserName,
					Nickname = u.Nickname,
					Email = u.Email,
					PhoneNumber = u.PhoneNumber,
					CreatorAssetId = u.CreatorAssets.FirstOrDefault().Id,
					TotalQuantity = u.CreatorAssets.FirstOrDefault().TotalQuantity,
					AvailableQuantity = u.CreatorAssets.FirstOrDefault().AvailableQuantity,
					CurrentValue = u.CreatorAssets.FirstOrDefault().CurrentValue,
					CreatorAssetStartDate = u.CreatorAssets.FirstOrDefault().StartDate,
					CreatorAssetEndDate = u.CreatorAssets.FirstOrDefault().EndDate,
					Description = u.CreatorAssets.FirstOrDefault().Description,
					CreatorAssetStatus = u.CreatorAssets.FirstOrDefault().Status.ToString(),
					IPOStartDate = u.CreatorAssets.FirstOrDefault().IPO != null ? u.CreatorAssets.FirstOrDefault().IPO.StartDate : (DateTime?)null,
					InitialPrice = u.CreatorAssets.FirstOrDefault().IPO != null ? u.CreatorAssets.FirstOrDefault().IPO.InitialPrice : 0,
					IPOStatus = u.CreatorAssets.FirstOrDefault().IPO != null ? u.CreatorAssets.FirstOrDefault().IPO.Status.ToString() : null
				})
				.FirstOrDefaultAsync();

			if (creator == null)
			{
				return NotFound();
			}

			return Ok(creator);
		}
	}
}