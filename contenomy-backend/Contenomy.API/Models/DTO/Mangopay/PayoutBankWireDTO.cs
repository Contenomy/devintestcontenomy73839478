namespace Contenomy.API.Models.DTO.Mangopay
{
	
	public class PayoutBankWireDTO
	{
		public string AuthorId { get; set; }
		public string Tag { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string BankAccountId { get; set; }
		public string DebitedWalletId { get; set; }
		public string BankWireRef { get; set; }

	}

}
