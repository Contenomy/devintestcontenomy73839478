namespace Contenomy.API.Models.DTO.Mangopay
{
	public class DirectCardPayInDTO
	{
		public string AuthorId { get; set; }
		public string CreditedWalletId { get; set; }
		public decimal DebitedFunds { get; set; }
		public decimal Fees { get; set; }
		public string CardId { get; set; }
		public string SecureModeReturnUrl { get; set; }
	}
}
