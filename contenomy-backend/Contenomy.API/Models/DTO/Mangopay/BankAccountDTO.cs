namespace Contenomy.API.Models.DTO.Mangopay
{
	public class BankAccountDTO
	{
		public string Id { get; set; }
		public string UserId { get; set; }
		public string Iban { get; set; }
		public string BIC { get; set; }
		public string AccountHolderName { get; set; }
		public string AccountType { get; set; } // IBAN, GB, US, etc.
	}

}
