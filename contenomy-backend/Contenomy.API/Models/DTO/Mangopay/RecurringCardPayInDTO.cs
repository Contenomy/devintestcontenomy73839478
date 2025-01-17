namespace Contenomy.API.Models.DTO.Mangopay
{
	public class Transaction
	{
		public string Currency { get; set; }
		public int Amount { get; set; }

	}
	
	

	public class RecurringCardPayInDTO

	{
		public string AuthorId { get; set; }
		public string CardId { get; set; }
		public string CreditedUserId { get; set; }
		public string CreditedWalletId { get; set; }
		public Transaction FirstTransactionDebitedFunds { get; set; }
		public Transaction FirstTransactionFees { get; set; }
		public Billing Billing { get; set; }
		public Shipping Shipping { get; set; }
		public int EndDate { get; set; }
		public string Frequency { get; set; }
		public bool FixedNextAmount { get; set; }
		public bool FractionedPayment { get; set; }
		public int FreeCycles { get; set; }
		public bool Migration { get; set; }
		public Transaction NextTransactionDebitedFunds { get; set; }
		public Transaction NextTransactionFees { get; set; }

	}
}
