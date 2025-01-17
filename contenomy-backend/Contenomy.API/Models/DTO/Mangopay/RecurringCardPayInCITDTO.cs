namespace Contenomy.API.Models.DTO.Mangopay
{
	
	public class RecurringCardPayInCITDTO
	{
		public string Tag { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string SecureModeReturnURL { get; set; }
		public string Culture { get; set; }
		public string StatementDescriptor { get; set; }
		public BrowserInfo BrowserInfo { get; set; }
		public string IpAddress { get; set; }
		public string RecurringPayinRegistrationId { get; set; }
		public string PreferredCardNetwork { get; set; }

	}
}
