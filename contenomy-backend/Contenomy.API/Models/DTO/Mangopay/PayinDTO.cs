namespace Contenomy.API.Models.DTO.Mangopay
{
	
	public class CreditedFunds
	{
		public string Currency { get; set; }
		public int Amount { get; set; }

	}
	
	public class SecurityInfo
	{
		public string AVSResult { get; set; }

	}
	
	
	public class CardInfo
	{
		public string BIN { get; set; }
		public string IssuingBank { get; set; }
		public string IssuerCountryCode { get; set; }
		public string Type { get; set; }
		public string Brand { get; set; }
		public string SubType { get; set; }

	}
	public class PayinDTO
	{
		public string Id { get; set; }
		public string Tag { get; set; }
		public int CreationDate { get; set; }
		public string AuthorId { get; set; }
		public string CreditedUserId { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public CreditedFunds CreditedFunds { get; set; }
		public Fees Fees { get; set; }
		public string Status { get; set; }
		public string ResultCode { get; set; }
		public string ResultMessage { get; set; }
		public DateTime ExecutionDate { get; set; }
		public string Type { get; set; }
		public string Nature { get; set; }
		public string CreditedWalletId { get; set; }
		public string DebitedWalletId { get; set; }
		public string PaymentType { get; set; }
		public string ExecutionType { get; set; }
		public string SecureMode { get; set; }
		public string CardId { get; set; }
		public string SecureModeReturnURL { get; set; }
		public string SecureModeRedirectURL { get; set; }
		public bool SecureModeNeeded { get; set; }
		public string Culture { get; set; }
		public SecurityInfo SecurityInfo { get; set; }
		public string StatementDescriptor { get; set; }
		public BrowserInfo BrowserInfo { get; set; }
		public string IpAddress { get; set; }
		public Billing Billing { get; set; }
		public Shipping Shipping { get; set; }
		public string  Requested3DSVersion { get; set; }
		public string Applied3DSVersion { get; set; }
		public string RecurringPayinRegistrationId { get; set; }
		public string PreferredCardNetwork { get; set; }
		public string PaymentCategory { get; set; }
		public CardInfo CardInfo { get; set; }

	}
}
