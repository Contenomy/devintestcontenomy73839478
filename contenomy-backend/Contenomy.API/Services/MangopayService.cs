using Contenomy.API.Models;
using Contenomy.API.Models.DTO;
using Contenomy.API.Models.DTO.Mangopay;
using Contenomy.Data;
using Contenomy.Data.Entities;
using InfluxDB.Client.Api.Domain;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
//using Microsoft.Extensions.Options;

namespace Contenomy.API.Services
{ 

   public class MangoPayService
	{
		private readonly ContenomyDbContext _context;
		private readonly IConfiguration _config;
		private readonly ILogger<MangoPayService> _logger;
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly BearerTokenHandler _tokenHandler;




		public MangoPayService(ContenomyDbContext context, ILogger<MangoPayService> logger, IConfiguration config, IHttpClientFactory httpClientFactory)
		{
			_context = context;
			_config = config;
			_logger = logger;
			_httpClientFactory = httpClientFactory;
			_tokenHandler = new BearerTokenHandler(httpClientFactory, config);

		}

		private async Task<HttpClient> CreateAuthorizedClient()
		{
			var client = _httpClientFactory.CreateClient();
			var token = await _tokenHandler.GetTokenAsync();
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
			return client;
		}

		#region gestioneUSER

		// restituisce un utente (natural payer, natural owner, legal payer, legal owner)
		public async Task<Object> GetUser(string userId)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{userId}");
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<UserNaturalDTO>();
		}

		// restituisce tutta la moneta elettronica accreditata e addebitata da quando l'utente è stato creato.
		public async Task<UserEmoneyDTO> GetUserEmoney(string userId)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{userId}/emoney");
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<UserEmoneyDTO>();
		}


		// Creare un utente naturale
		public async Task<UserNaturalDTO> CreateNaturalUser(UserNaturalCreateDTO user)
		{
			try
			{

			
				var client = await CreateAuthorizedClient();
				var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/natural", user);
				response.EnsureSuccessStatusCode();
				return await response.Content.ReadFromJsonAsync<UserNaturalDTO>();
			}
			catch (Exception ex)
			{

				return null;
			}
		}

		// Modifica un utente naturale
		public async Task<UserNaturalDTO> UpdateNaturalUser(string userId, UserNaturalCreateDTO user)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.PutAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/natural/{userId}", user);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<UserNaturalDTO>();
		}

		// Creare un utente legale
		public async Task<UserLegalDTO> CreateLegalUser(LegalUserCreateDTO user)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/legal", user);

			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<UserLegalDTO>();
		}

		// Modifica un utente legale
		public async Task<UserLegalDTO> UpdateLegalUser(string userId, LegalUserCreateDTO user)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.PutAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/legal/{userId}", user);

			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<UserLegalDTO>();
		}
		#endregion

		#region gestioneWALLET
		public async Task<WalletDTO> CreateWalletAsync(WalletCreateDTO walletDto)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/wallets", walletDto);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<WalletDTO>();
		}

		// restituisce il wallet.
		public async Task<WalletDTO> GetWallet(string walletId)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/wallets/{walletId}");
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<WalletDTO>();
		}

		// restituisce il wallet.
		public async Task<List<WalletDTO>> GetUserWallets(string userId)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{userId}/wallets");
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<List<WalletDTO>>();
		}


		// Transfer between wallets
		public async Task<TransferDTO> CreateTransfer(TransferDTO transfer)
		{
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/transfers", transfer);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<TransferDTO>();

		}
		#endregion

		#region gestioneDOCUMENT
		// Submit KYC Document
		public async Task<KeyDocumentDTO> CreateKyc(string userID, KycDocumentCreateDTO document)
		{

			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{userID}/kyc/documents", document);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<KeyDocumentDTO>();
		}
		// Submit KYC Document file
		public async Task<KeyDocumentDTO> CreateKycDocument(string userID, KycDocumentCreateDTO document, string base64FileContent)
		{
			Task<KeyDocumentDTO> Kyc = CreateKyc(userID, document);

			//CREA DOCUMENTO 
			var client = await CreateAuthorizedClient();
			var contentFile = new StringContent(base64FileContent, Encoding.UTF8, "application/json");

			//CREA FILE
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{userID}/kyc/documents{Kyc.Id}/pages", contentFile);
			response.EnsureSuccessStatusCode();

			///VALIDAZIONE
			var jsonObject = new { Status = "VALIDATION_ASKED" };
			string jsonString = JsonConvert.SerializeObject(jsonObject);
			response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{userID}/kyc/documents{Kyc.Id}", jsonString);
			response.EnsureSuccessStatusCode();


			return await response.Content.ReadFromJsonAsync<KeyDocumentDTO>();
		}
		#endregion

		#region gestioneCARD
		// Register a card
		public async Task<CardRegistrationDTO> RegisterCard(CardRegistrationCreateDTO cardRegistration)
		{
			//for more information go to https://docs.mangopay.com/api-reference/card-registrations/create-card-registration

			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/cardregistrations", cardRegistration);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadFromJsonAsync<CardRegistrationDTO>();
		}

		// Tokenize card
		public async Task<string> TokenizeCard(TokenizeCardDTO card)
		{
			//for more information go to https://docs.mangopay.com/api-reference/card-registrations/tokenize-card

			// Create the form data as key-value pairs
			var formData = new Dictionary<string, string>
			{
				{ "accessKeyRef", card.accessKeyRef },
				{ "data", card.data },
				{ "cardNumber", card.cardNumber },
				{ "cardExpirationDate", card.cardExpirationDate },
				{ "cardCvx", card.cardCvx }
			};

			// Convert the form data to HttpContent
			var content = new FormUrlEncodedContent(formData);
			var client = await CreateAuthorizedClient();
			// Send the POST request to the MangoPay API
			var response = await client.PostAsJsonAsync(card.cardRegistrationUrl, content);

			// Ensure the request was successful
			response.EnsureSuccessStatusCode();

			// Get the response content as a string (tokenized card data)
			string result = await response.Content.ReadAsStringAsync();

			// Return the result
			return result;
		}

		// Create direct card payin
		public async Task<JsonDocument> CreateDirectCardPayIn(PayInDirectCreateDTO payIn)
		{
			//for more information go to https://docs.mangopay.com/api-reference/direct-card-payins/create-direct-card-payin

			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payins/card/direct", payIn);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		// Create direct web card payin
		public async Task<JsonDocument> CreateWebCardPayIn(PayInWebDirectCreateDTO payIn)
		{
			//for more information go to https://docs.mangopay.com/api-reference/web-card-payins/create-web-card-payin
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payins/card/web", payIn);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		// Create recurring card PayIn registrations
		public async Task<JsonDocument> CreateRecurringCardPayInRegistrations(RecurringCardPayInDTO payIn)
		{
			//for more information go to https://docs.mangopay.com/api-reference/recurring-payin-registrations/create-recurring-payin-registration

			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/recurringpayinregistrations", payIn);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}


		// Create recurring card PayIn CIT
		public async Task<JsonDocument> CreateRecurringCardPayInCIT(RecurringCardPayInCITDTO payIn)
		{
			//for more information go to https://docs.mangopay.com/api-reference/recurring-card-payins/create-recurring-payin-cit

			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payins/recurring/card/direct", payIn);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		// Create recurring card PayIn MIT
		public async Task<JsonDocument> CreateRecurringCardPayInMIT(RecurringCardPayInMITDTO payIn)
		{
			//for more information go to https://docs.mangopay.com/api-reference/recurring-card-payins/create-recurring-payin-mit

			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payins/recurring/card/direct", payIn);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		#endregion

		#region gestioneBANK
		public async Task<JsonDocument> CreateBankAccountIBAN(string userId, BankAccountDTO bankAccount)
		{
			//for more information go to https://docs.mangopay.com/api-reference/bank-accounts/create-iban-bank-account
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/users/{userId}/bankaccounts/iban", bankAccount);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}


		public async Task<JsonDocument> CreateBankAccountUS(string userId, BanckAccountDTOus bankAccount)
		{
			//for more information go to https://docs.mangopay.com/api-reference/bank-accounts/create-us-bank-account
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/users/{userId}/bankaccounts/us", bankAccount);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> CreateBankAccountCA(string userId, BanckAccountDTOca bankAccount)
		{
			//for more information go to https://docs.mangopay.com/api-reference/bank-accounts/create-ca-bank-account
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/users/{userId}/bankaccounts/ca", bankAccount);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> CreateBankAccountGB(string userId, BanckAccountDTOgb bankAccount)
		{
			//for more information go to https://docs.mangopay.com/api-reference/bank-accounts/create-gb-bank-account
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/users/{userId}/bankaccounts/gb", bankAccount);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> CreateBankAccountOTHER(string userId, BanckAccountDTOother bankAccount)
		{
			//for more information go to https://docs.mangopay.com/api-reference/bank-accounts/create-other-bank-account
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/users/{userId}/bankaccounts/other", bankAccount);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		

		#endregion

		#region Payout
		public async Task<JsonDocument> CreatePayout(PayoutBankWireDTO payout)
		{
			//for more information go to https://docs.mangopay.com/api-reference/payouts/create-payout
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payouts/bankwire", payout);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> PayoutReachability(PayoutReachabilityDTO payout)
		{
			//for more information go to https://docs.mangopay.com/api-reference/payouts/check-instant-payout-eligibility
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payouts/reachability", payout);
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> PayoutView(string PayoutId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/payouts/view-payout
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payouts/{PayoutId}");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> PayoutBankwireView(string PayoutId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/payouts/view-payout-check-mode-applied
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payouts/bankwire/{PayoutId}");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		#endregion

		#region Conversions
		public async Task<JsonDocument> ConversionsRateView(string DebitedCurrency, string CreditedCurrency)
		{
			//for more information go to https://docs.mangopay.com/api-reference/conversion-rates/view-conversion-rate
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/conversions/rate/{DebitedCurrency}/{CreditedCurrency}");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> CreateQuote(QuoteDTO quote)
		{
			//for more information go to https://docs.mangopay.com/api-reference/quotes/create-quote
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/payouts/reachability", quote );
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> QuoteView(string QuoteId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/quotes/view-quote
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/conversions/quote/{QuoteId}");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}


		public async Task<JsonDocument> QuotedConversionUserWallets(QuoteWalletDTO quote)
		{
			//for more information go to https://docs.mangopay.com/api-reference/conversions/create-quoted-conversion-user-wallets
			var client = await CreateAuthorizedClient();
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/conversions/quoted-conversion", quote );
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> IstantConversionUserWallets(InstantConversionWalletDTO quote)
		{
			//for more information go to https://docs.mangopay.com/api-reference/conversions/create-instant-conversion-user-wallets
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/conversions/instant-conversion", quote );
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> QuotedConversionClientWallets(QuoteClietDTO quote)
		{
			//for more information go to https://docs.mangopay.com/api-reference/conversions/create-quoted-conversion-client-wallets
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/clients/conversions/quoted-conversion", quote );
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> IstantConversionClientWallets(InstantConversionClientDTO quote)
		{
			//for more information go to https://docs.mangopay.com/api-reference/conversions/create-instant-conversion-client-wallets
			var client = await CreateAuthorizedClient(); 
			var response = await client.PostAsJsonAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/clients/conversions/instant-conversion", quote );
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> ConversionView(string ConversionId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/conversions/view-conversion
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/conversions/quote/{ConversionId}");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		#endregion

		#region Transactions
		public async Task<JsonDocument> TransactionListUser(string UserId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-user
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/users/{UserId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> TransactionListWallet(string WalletId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-wallet
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/wallets/{WalletId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> TransactionListClientWallet(string FundsType, string Currency)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-client-wallet
			var client = await CreateAuthorizedClient();
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/clients/wallets/{FundsType}/{Currency}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> TransactionListCard(string CardId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-card
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/cards/{CardId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> TransactionListCardFingerprint(string Fingerprint)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-card-fingerprint
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/cards/fingerprints/{Fingerprint}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> TransactionListPreauthorizations(string PreauthorizationId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-preauthorization
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/preauthorizations/{PreauthorizationId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> TransactionListDepositPreauthorizations(string DepositId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-deposit-preauthorization
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/deposit-preauthorizations/{DepositId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> TransactionListBankAccount(string BankAccountId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-bank-account
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/bankaccounts/{BankAccountId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}

		public async Task<JsonDocument> TransactionListMandate(string MandateId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-mandate
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/mandates/{MandateId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		public async Task<JsonDocument> TransactionListDispute(string DisputeId)
		{
			//for more information go to https://docs.mangopay.com/api-reference/transactions/list-transactions-dispute
			var client = await CreateAuthorizedClient(); 
			var response = await client.GetAsync($"{_config["Mangopay:sandbox"]}/{_config["Mangopay:clientId"]}/disputes/{DisputeId}/transactions");
			response.EnsureSuccessStatusCode();
			var jsonResponse = await response.Content.ReadAsStringAsync();
			return JsonDocument.Parse(jsonResponse);
		}
		#endregion


	}

}


/// Service che implementa le api mangopay
/// per ogni chiarimento sul funzionamento delle api fare riferimento alla documentazione https://docs.mangopay.com/api-reference/overview/introduction
/// ogni metodo impelemta il bearer token che viene staccato dalla funzione CreateAuthorizedClient
/// ad ogni chiamata controlal se il token è ancora valido e non scaduto, in caso contrario ne crea uno nuovo