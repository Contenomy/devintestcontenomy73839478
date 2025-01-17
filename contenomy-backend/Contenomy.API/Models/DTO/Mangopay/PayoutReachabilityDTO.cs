namespace Contenomy.API.Models.DTO.Mangopay
{

	public class PayoutReachabilityDTO
	{
		public string PayoutModeRequested { get; set; }
		public string AuthorId { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string DebitedWalletId { get; set; }
		public string BankAccountId { get; set; }
		public DateTime BankWireRef { get; set; }

	}

}
