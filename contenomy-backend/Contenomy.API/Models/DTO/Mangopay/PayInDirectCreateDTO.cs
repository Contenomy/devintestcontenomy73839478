namespace Contenomy.API.Models.DTO.Mangopay
{
	
	public class BrowserInfo
	{
		public string AcceptHeader { get; set; }
		public bool JavaEnabled { get; set; }
		public string Language { get; set; }
		public int ColorDepth { get; set; }
		public int ScreenHeight { get; set; }
		public int ScreenWidth { get; set; }
		public int TimeZoneOffset { get; set; }
		public string UserAgent { get; set; }
		public bool JavascriptEnabled { get; set; }

	}

	public class Billing
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public Address Address { get; set; }

	}

	public class Shipping
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public Address Address { get; set; }

	}
	public class PayInDirectCreateDTO
	{
		public string Tag { get; set; }
		public string AuthorId { get; set; }
		public string CreditedUserId { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string CreditedWalletId { get; set; }
		public string SecureMode { get; set; }
		public string CardId { get; set; }
		public string SecureModeReturnURL { get; set; }
		public string StatementDescriptor { get; set; }
		public BrowserInfo BrowserInfo { get; set; }
		public string IpAddress { get; set; }
		public Billing Billing { get; set; }
		public Shipping Shipping { get; set; }

	}



}
