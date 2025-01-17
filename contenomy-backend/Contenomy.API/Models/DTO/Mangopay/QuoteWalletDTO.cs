namespace Contenomy.API.Models.DTO.Mangopay
{
	public class QuoteWalletDTO
	{
		public string QuoteId { get; set; }
		public string AuthorId { get; set; }
		public string DebitedWalletId { get; set; }
		public string CreditedWalletId { get; set; }
		public string Tag { get; set; }

	}
}
