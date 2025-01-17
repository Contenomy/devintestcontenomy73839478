using Contenomy.API.Models;
using Contenomy.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Contenomy.API.Controllers
{
	[ApiController]
    [Route("/auth/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ContenomyUser> _signInManager;
        private readonly UserManager<ContenomyUser> _userManager;

        public AuthController(SignInManager<ContenomyUser> signInManager, UserManager<ContenomyUser> userManager)
        {
            _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
            _userManager = _signInManager.UserManager;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserProfile))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        public async Task<IActionResult> Profile()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Ok(new UserProfile(null));
            }
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return BadRequest("Utente non trovato");
                }
                var profile = new UserProfile(user)
                {
                    Roles = await _userManager.GetRolesAsync(user),
                    Claims = (await _userManager.GetClaimsAsync(user))
                        .ToDictionary(el => el.Type, el => el.Value)
                };
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest($"Errore durante il recupero del profilo: {ex.Message}");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
        public async Task<IActionResult> Login([FromForm] string username, [FromForm] string password)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Specificare il nome utente");
            }
            if (string.IsNullOrEmpty(password))
            {
                return BadRequest("Specificare la password");
            }
            var result = await _signInManager.PasswordSignInAsync(username, password, true, false);
            if (result.Succeeded)
            {
                // Dopo il login riuscito, recupera il profilo dell'utente
                var user = await _userManager.FindByNameAsync(username);
                var profile = new UserProfile(user)
                {
                    Roles = await _userManager.GetRolesAsync(user),
                    Claims = (await _userManager.GetClaimsAsync(user))
                        .ToDictionary(el => el.Type, el => el.Value)
                };
                return Ok(profile);
            }
            else
            {
                return Unauthorized("Username o password non validi");
            }
        }
    }
}