namespace Contenomy.API.Models.DTO.Mangopay
{
	public class DebitedFunds
	{
		public string Currency { get; set; }
		public double Amount { get; set; }
	}

	public class Fees
	{
		public string Currency { get; set; }
		public double Amount { get; set; }
	}

	public class TransferDTO
	{
		public string Tag { get; set; }
		public string AuthorId { get; set; }
		public string CreditedUserId { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string DebitedWalletId { get; set; }
		public string CreditedWalletId { get; set; }
	}

}
