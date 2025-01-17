using Contenomy.API.Models.DTO;
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
    public class RatingController : ControllerBase
    {
        private readonly ContenomyDbContext _context;
        private readonly UserManager<ContenomyUser> _userManager;


        public RatingController(ContenomyDbContext context, UserManager<ContenomyUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

 

        [HttpPost]
        public async Task<IActionResult> InsertRating([FromBody] RatingDTO ratingData)
        {
            if (ratingData == null)
            {
                return BadRequest("No data specified");
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null || user.Id == null)
            {
                return Unauthorized();
            }

            var userId = user.Id;

            // Trova la voce del rating corrispondente per l'utente
            var entry =  await _context.Ratings
                .Where(e => e.UserId == userId)
                .FirstOrDefaultAsync();

            if (entry == null)
            {
                /// non esiste alcun rating presente per l'utente passato
                var rating = new Ratings
                {
                    Value = ratingData.Value,
                    UserId = userId,
                    Feedback = ratingData.Feedback,
                    Timestamp = DateTime.UtcNow
                };
                _context.Ratings.Add(rating);
                await _context.SaveChangesAsync();
            }
            else
            {
                ///controllo la scadenza dell'ultimo rating presente, se inferiore a 7 giorni allora sovrascrivo, altrimenti ne creo uno nuovo
                DateTime scadenza = entry.Timestamp.AddDays(7);
                if ( scadenza < DateTime.UtcNow )
                {
                    entry.Value = ratingData.Value;
                    entry.Feedback = ratingData.Feedback;
                    entry.Timestamp = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var rating = new Ratings
                    {
                        Value = ratingData.Value,
                        UserId = userId,
                        Feedback = ratingData.Feedback,
                        Timestamp = DateTime.UtcNow
                    };
                    _context.Ratings.Add(rating);
                    await _context.SaveChangesAsync();

                }
            }

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetLastRating()
        {
            Ratings rating=new Ratings();
            var user = await _userManager.GetUserAsync(User);
            if (user == null || user.Id == null)
            {
                return Unauthorized();
            }

            var userId = user.Id;

            // Trova la voce del rating corrispondente per l'utente
            var entry = await _context.Ratings
                .Where(e => e.UserId == userId).OrderByDescending(e => e.Timestamp).Take(1)
                .FirstOrDefaultAsync();

            if (entry != null)
            {
                rating.Value = entry.Value;
                rating.UserId = userId;
                rating.Feedback = entry.Feedback;
                rating.Timestamp = entry.Timestamp;
            }
            return Ok(rating);
        }
    }

   
}
