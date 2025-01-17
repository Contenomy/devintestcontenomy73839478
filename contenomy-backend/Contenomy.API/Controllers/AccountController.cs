using Contenomy.API.Models.DTO;
using Contenomy.API.Models.DTO.Mangopay;
using Contenomy.API.Services;
using Contenomy.API.Shared;
using Contenomy.Data;
using Contenomy.Data.Entities;
using Contenomy.Data.Enums;
using InfluxDB.Client.Api.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using System.Globalization;

namespace Contenomy.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ContenomyDbContext _context;
        private readonly UserManager<ContenomyUser> _userManager;

        private readonly MangoPayService _mangoPayService;


        public AccountController(ContenomyDbContext context, UserManager<ContenomyUser> userManager, MangoPayService mangoPayService)
        {
            _context = context;
            _userManager = userManager;
            _mangoPayService = mangoPayService;
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateUser([FromBody] AccountDTO accountData)
        {
            var user = new ContenomyUser
            {
                UserName = accountData.username,
                Email = accountData.email,
                Nickname = accountData.nickname,
                EmailConfirmed = false
            };

            var result = await _userManager.CreateAsync(user, accountData.password);

            if (result.Succeeded)
            {

                await _userManager.SetEmailAsync(user, accountData.email);
                await _userManager.SetPhoneNumberAsync(user, accountData.phonenumber);

                await _userManager.AddToRoleAsync(user, "None");

                // Aggiungi rivendicazioni (Claims) per l'utente
                await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("SocialRole", "Follower"));

                var now = DateTime.UtcNow;

                now = now.AddMicroseconds(-now.Microsecond);
                now = now.AddMilliseconds(-now.Millisecond);
                // Send mail
                var verificationRequest = new EmailVerificationRequest
                {
                    UserId = user.Id,
                    RequestOn = now,
                    ExpiresOn = now.Date.AddDays(3)
                };

                _context.EmailVerificationRequests.Add(verificationRequest);
                await _context.SaveChangesAsync();

                EmailHelper.SendVerificationEmail(accountData.email, verificationRequest);
                return Ok(user);
            }



            // Gestisci gli errori in caso di fallimento
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }
        [Authorize]
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAccount([FromBody] AccountDTO accountData)
        {
            // Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound("User not found");
            }

            if (accountData.email != user.Email)
            {
                // Update email
                var emailResult = await _userManager.SetEmailAsync(user, accountData.email);
                if (!emailResult.Succeeded)
                {
                    return BadRequest(emailResult.Errors);
                }
            }
            if (accountData.phonenumber != user.PhoneNumber)
            {
                // Update phone number
                var phoneResult = await _userManager.SetPhoneNumberAsync(user, accountData.phonenumber);
                if (!phoneResult.Succeeded)
                {
                    return BadRequest(phoneResult.Errors);
                }
            }

            user.Nickname = accountData.nickname;
            // Save changes to the database
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            return Ok();
        }
        [Authorize]
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdatePersonalData([FromBody] PersonalDataDTO personalData)
        {
            if (personalData == null)
            {
                return BadRequest("No data specified");
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null || user.Id == null)
            {
                return Unauthorized();
            }

            personalData.userid = user.Id;


            // Trova la voce del rating corrispondente per l'utente
            var entry = await _context.personaldata
                .Where(e => e.UserId == user.Id)
                .FirstOrDefaultAsync();
            if (entry == null)
            {
                // If entry doesn't exist, create a new `PersonalData` object
                var persData = new PersonalData
                {
                    UserId = personalData.userid,
                    Name = personalData.nome,
                    Surname = personalData.cognome,
                    Gender = personalData.sesso.HasValue ? personalData.sesso.Value : default,
                    BirthDate = personalData.datanascita,
                    Nationality = personalData.nazionalita,
                    BirthCity = personalData.cittanascita,
                    BirthNation = personalData.nazionenascita,
                    CodiceFiscale = personalData.codicefiscale,
                    ResidenceCity = personalData.cittaresidenza,
                    ResidenceCountry = personalData.provinciaresidenza,
                    CAP = personalData.capresidenza,
                    Address = personalData.indirizzoresidenza,
                };

                _context.personaldata.Add(persData);
                await _context.SaveChangesAsync();

                /// Create mangopay account/wallet
                if (persData.MangpayUserId == null)
                {
                    UserNaturalDTO nUsr = await CreateNaturalUser(persData, user.Email);
                    persData.MangpayUserId = nUsr.Id;
                }
                if (persData.MangopayWalletId == null)
                {
                    WalletDTO nWal = await CreateWallet(persData.MangpayUserId);
                    persData.MangopayWalletId = nWal.Id;
                }
                await _context.SaveChangesAsync();

            }
            else
            {
                // Check for changes between entry and personalData
                bool isChanged = false;

                if (entry.Name != personalData.nome) { entry.Name = personalData.nome; isChanged = true; }
                if (entry.Surname != personalData.cognome) { entry.Surname = personalData.cognome; isChanged = true; }
                if (entry.Gender != personalData.sesso) { entry.Gender = personalData.sesso; isChanged = true; }
                if (entry.BirthDate != personalData.datanascita) { entry.BirthDate = personalData.datanascita; isChanged = true; }
                if (entry.Nationality != personalData.nazionalita) { entry.Nationality = personalData.nazionalita; isChanged = true; }
                if (entry.BirthCity != personalData.cittanascita) { entry.BirthCity = personalData.cittanascita; isChanged = true; }
                if (entry.BirthNation != personalData.nazionenascita) { entry.BirthNation = personalData.nazionenascita; isChanged = true; }
                if (entry.CodiceFiscale != personalData.codicefiscale) { entry.CodiceFiscale = personalData.codicefiscale; isChanged = true; }
                if (entry.ResidenceCity != personalData.cittaresidenza) { entry.ResidenceCity = personalData.cittaresidenza; isChanged = true; }
                if (entry.ResidenceCountry != personalData.provinciaresidenza) { entry.ResidenceCountry = personalData.provinciaresidenza; isChanged = true; }
                if (entry.CAP != personalData.capresidenza) { entry.CAP = personalData.capresidenza; isChanged = true; }
                if (entry.Address != personalData.indirizzoresidenza) { entry.Address = personalData.indirizzoresidenza; isChanged = true; }

                /// Create mangopay account/wallet
                if (entry.MangpayUserId == null)
                {
                    isChanged = true;
                    UserNaturalDTO nUsr = await CreateNaturalUser(entry, user.Email);
                    entry.MangpayUserId = nUsr.Id;
                }
                if (entry.MangopayWalletId == null)
                {
                    isChanged = true;
                    WalletDTO nWal = await CreateWallet(entry.MangpayUserId);
                    entry.MangopayWalletId = nWal.Id;
                }
                if (isChanged)
                    await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [Authorize]
        [HttpGet("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPersonalData()
        {

            var user = await _userManager.GetUserAsync(User);
            if (user == null || user.Id == null)
            {
                return Unauthorized();
            }
            // Trova la voce corrispondente per l'utente
            var entry = await _context.personaldata
                .Where(e => e.UserId == user.Id)
                .FirstOrDefaultAsync();

            if (entry == null)
                return Ok(new PersonalData());

            if (entry.BirthDate != null)
                entry.BirthDate = entry.BirthDate.Replace(" 00:00:00", "");

            return Ok(entry);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> VerifyEmail(string verificationId, DateTime requestOn, DateTime expire)
        {
            // Get verification request from DB and check dates

            EmailVerificationRequest? request = _context.EmailVerificationRequests.FirstOrDefault(f => f.Id == verificationId && f.Valid);

            async Task<IActionResult> Invalidate()
            {
                request.Valid = false;
                await _context.SaveChangesAsync();
                return BadRequest();
            }

            if (request == null)
            {
                return BadRequest();
            }

            string userId = request.UserId;
            var user = await _userManager.FindByIdAsync(userId);

            bool invalid = user is null || request.RequestOn != requestOn || request.ExpiresOn != expire || request.ExpiresOn <= DateTime.UtcNow;


            if (invalid)
            {
                return await Invalidate();
            }

            request.Valid = false;

            user!.EmailConfirmed = true;

            await _userManager.UpdateAsync(user);

            await _context.SaveChangesAsync();

            return Ok();
        }


        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> GenerateVerificationRequest(DateTime expire)
        {
            // Get verification request from DB and check dates

            var now = DateTime.UtcNow;

            now = now.AddMicroseconds(now.Microsecond);
            now = now.AddMilliseconds(now.Millisecond);

            EmailVerificationRequest? request = new EmailVerificationRequest
            {
                UserId = _userManager!.GetUserId(User)!,
                ExpiresOn = expire,
                RequestOn = now,
            };

            _context.EmailVerificationRequests.Add(request);

            await _context.SaveChangesAsync();

            return Ok();
        }


        ////// PRIVATE function //////



        private async Task<UserNaturalDTO> CreateNaturalUser(PersonalData pers, String email)
        {
            UserNaturalCreateDTO user = new UserNaturalCreateDTO();
            user.FirstName = pers.Name;
            user.LastName = pers.Surname;
            user.Email = email;
            user.TermsAndConditionsAccepted = true;
            user.UserCategory = "PAYER";
            user.Birthday = null;

            try
            {
                UserNaturalDTO createdUser = await _mangoPayService.CreateNaturalUser(user);
                return createdUser;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        private async Task<WalletDTO> CreateWallet(String UserId)
        {
            WalletCreateDTO wallet = new WalletCreateDTO();
            wallet.Currency = "EUR";
            wallet.Owners = [UserId];
            wallet.Description = "Contenomy";


            try
            {
                WalletDTO createdWallet = await _mangoPayService.CreateWalletAsync(wallet);
                return createdWallet;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


    }


}
