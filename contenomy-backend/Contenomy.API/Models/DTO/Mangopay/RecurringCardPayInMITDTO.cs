namespace Contenomy.API.Models.DTO.Mangopay
{
	



	public class RecurringCardPayInMITDTO
	{
		public string Tag { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string StatementDescriptor { get; set; }
		public string RecurringPayinRegistrationId { get; set; }

	}
}
