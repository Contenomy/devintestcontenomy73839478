namespace Contenomy.API.Models.DTO.Mangopay
{
	public class PayoutDTO
	{
		public string Id { get; set; }
		public string DebitedWalletId { get; set; }
		public string BankAccountId { get; set; }
		public string DebitedFundsCurrency { get; set; }
		public decimal DebitedFundsAmount { get; set; }
		public string BankWireRef { get; set; }
	}

}
