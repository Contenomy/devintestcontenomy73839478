using Contenomy.API.Models.DTO;
using InfluxDB.Client.Api.Domain;
using System.Net.Http.Headers;
using System.Text;

namespace Contenomy.API.Services
{
	public class BearerTokenHandler
	{
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly IConfiguration _config;
		private string _token;
		private DateTime _tokenExpiration;

		public BearerTokenHandler(IHttpClientFactory httpClientFactory, IConfiguration config)
		{
			_httpClientFactory = httpClientFactory;
			_config = config;
		}

		// Metodo per ottenere un token Bearer
		public async Task<string> GetTokenAsync()
		{
			if (string.IsNullOrEmpty(_token) || DateTime.UtcNow >= _tokenExpiration)
			{
				var client = _httpClientFactory.CreateClient();
				var urltoken = _config.GetValue<string>("Mangopay:sandbox") + _config.GetValue<string>("Mangopay:TokenUrl");
				var clientId = _config.GetValue<string>("Mangopay:clientId");
				var clientSecret = _config.GetValue<string>("Mangopay:apiKey");
				
				var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

				// Aggiungi l'intestazione Authorization con Basic Authentication
				client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);

				// Effettua la richiesta per ottenere il token
				var response = await client.PostAsJsonAsync(urltoken, new
				{
					grant_type = "client_credentials"
				});

				if (response.IsSuccessStatusCode)
				{
					var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponseDTO>();
					_token = tokenResponse.access_token;
					_tokenExpiration = DateTime.UtcNow.AddSeconds(tokenResponse.expires_in);
				}
				else
				{
					throw new Exception("Failed to retrieve Bearer token.");
				}
			}

			return _token;
		}
	}

}
