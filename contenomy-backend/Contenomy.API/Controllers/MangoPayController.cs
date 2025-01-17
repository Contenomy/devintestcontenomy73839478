using Contenomy.API.Models.DTO;
using Contenomy.API.Models.DTO.Mangopay;
using Contenomy.API.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;




namespace Contenomy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MangoPayController : ControllerBase
    {
        private readonly MangoPayService _mangoPayService;
	
		public MangoPayController(MangoPayService mangoPayService)
        {
			_mangoPayService = mangoPayService;
        }
		// Get: api/mangopay/get-user
		[HttpGet("get-user")]
		public async Task<IActionResult> GetUser(string userID)
		{
			try
			{
				var User = await _mangoPayService.GetUser(userID);
			return Ok(User);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// Get: api/mangopay/get-user
		[HttpGet("get-user-emoney")]
		public async Task<IActionResult> GetUserEmoney(string userID)
		{
			try
			{
				var User = await _mangoPayService.GetUserEmoney(userID);
				return Ok(User);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// POST: api/mangopay/create-natural-user
		[HttpPost("create-natural-user")]
		public async Task<IActionResult> CreateNaturalUser([FromBody] UserNaturalCreateDTO user)
		{
			try
			{
				var createdUser = await _mangoPayService.CreateNaturalUser(user);
				return Ok(createdUser);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// PUT: api/mangopay/update-natural-user
		[HttpPut("update-natural-user")]
		public async Task<IActionResult> UpdateNaturalUser(string userID, [FromBody] UserNaturalCreateDTO user)
		{
			try
			{
				var createdUser = await _mangoPayService.UpdateNaturalUser(userID, user);
				return Ok(createdUser);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// POST: api/mangopay/create-legal-user
		[HttpPost("create-legal-user")]
		public async Task<IActionResult> CreateLegalUser([FromBody] LegalUserCreateDTO user)
		{
			try
			{
				var createdUser = await _mangoPayService.CreateLegalUser(user);
				return Ok(createdUser);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// PUT: api/mangopay/update-legal-user
		[HttpPut("update-legal-user")]
		public async Task<IActionResult> UpdteLegalUser(string userID, [FromBody] LegalUserCreateDTO user)
		{
			try
			{
				var User = await _mangoPayService.UpdateLegalUser(userID, user);
				return Ok(User);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// POST: api/mangopay/create-wallet
		[HttpPost("create-wallet")]
		public async Task<IActionResult> CreateWallet([FromBody] WalletCreateDTO wallet)
		{
			try
			{
				var createdWallet = await _mangoPayService.CreateWalletAsync(wallet);
				return Ok(createdWallet);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// GET: api/mangopay/get-wallet
		[HttpGet("get-wallet")]
		public async Task<IActionResult> GetWallet(string walletID)
		{
			try
			{
				var createdWallet = await _mangoPayService.GetWallet(walletID);
				return Ok(createdWallet);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// GET: api/mangopay/get-wallet
		[HttpGet("get-user-wallets")]
		public async Task<IActionResult> GetUserWallets(string userID)
		{
			try
			{
				var Wallets = await _mangoPayService.GetUserWallets(userID);
				return Ok(Wallets);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		// POST: api/mangopay/transfer
		[HttpPost("transfer")]
		public async Task<IActionResult> CreateTransfer([FromBody] TransferDTO transfer)
		{
			try
			{
				var createdTransfer = await _mangoPayService.CreateTransfer(transfer);
				return Ok(createdTransfer);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}
		#region gestioneCARD
		// POST: api/mangopay/register-card
		[HttpPost("register-card")]
		public async Task<IActionResult> RegisterCard([FromBody] CardRegistrationCreateDTO cardRegistration)
		{
			try
			{
				var registeredCard = await _mangoPayService.RegisterCard(cardRegistration);
				return Ok(registeredCard);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message});
			}
		}
		// POST: api/mangopay/tokenize-card
		[HttpPost("tokenize-card")]
		public async Task<IActionResult> TokenizeCard([FromBody] TokenizeCardDTO card)
		{
			try
			{
				var registeredCard = await _mangoPayService.TokenizeCard(card);
				return Ok(registeredCard);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-direct-card-payin")]
		public async Task<IActionResult> CreateDirectCardPayIn([FromBody] PayInDirectCreateDTO card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateDirectCardPayIn(card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-web-card-payin")]
		public async Task<IActionResult> CreateWebCardPayIn([FromBody] PayInWebDirectCreateDTO card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateWebCardPayIn(card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-recurring-card-payin-registration")]
		public async Task<IActionResult> CreateRecurringCardPayInRegistrations([FromBody] RecurringCardPayInDTO card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateRecurringCardPayInRegistrations(card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-recurring-card-payin-cit")]
		public async Task<IActionResult> CreateRecurringCardPayInCIT([FromBody] RecurringCardPayInCITDTO card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateRecurringCardPayInCIT(card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-recurring-card-payin-mit")]
		public async Task<IActionResult> CreateRecurringCardPayInMIT([FromBody] RecurringCardPayInMITDTO card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateRecurringCardPayInMIT(card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}


		#endregion

		#region gestioneBANK

		[HttpPost("create-bank-account-iban")]
		public async Task<IActionResult> CreateBankAccountIBAN(string userID, [FromBody] BankAccountDTO card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateBankAccountIBAN(userID,card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-bank-account-us")]
		public async Task<IActionResult> CreateBankAccountUS(string userID, [FromBody] BanckAccountDTOus card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateBankAccountUS(userID,card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("create-bank-account-ca")]
		public async Task<IActionResult> CreateBankAccountCA(string userID, [FromBody] BanckAccountDTOca card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateBankAccountCA(userID, card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}


		[HttpPost("create-bank-account-gb")]
		public async Task<IActionResult> CreateBankAccountGB(string userID, [FromBody] BanckAccountDTOgb card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateBankAccountGB(userID, card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}


		[HttpPost("create-bank-account-other")]
		public async Task<IActionResult> CreateBankAccountOther(string userID, [FromBody] BanckAccountDTOother card)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateBankAccountOTHER(userID, card);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		#endregion


		#region GestioneDocumento
		// POST: api/mangopay/transfer
		[HttpPost("CreateKyc")]
		public async Task<IActionResult> CreateKyc(string userID, [FromBody] KycDocumentCreateDTO document)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateKyc(userID, document);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}

		[HttpPost("CreateKycDocument")]
		public async Task<IActionResult> CreateKycDocument(string userID, KycDocumentCreateDTO document, string base64FileContent)
		{
			try
			{
				var responseOBJ = await _mangoPayService.CreateKycDocument(userID, document, base64FileContent);
				return Ok(responseOBJ);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}
		#endregion

		//// POST: api/mangopay/payout
		//[HttpPost("payout")]
		//public async Task<IActionResult> CreateBanckPayout([FromBody] PayOutBankWirePostDTO payout)
		//{
		//    var createdPayout = await _mangoPayService.CreateBankPayout(payout);
		//    return Ok(createdPayout);
		//}

		//// POST: api/mangopay/kyc-document
		//[HttpPost("kyc-document")]
		//public async Task<IActionResult> CreateKycDocument([FromBody] KycDocumentCreateDTO document)
		//{
		//    var createdDocument = await _mangoPayService.CreateKycDocument(document);
		//    return Ok(createdDocument);
		//}
	}
}

/// Controller che implementa i metodi messi a disposizione dal service Mangopay