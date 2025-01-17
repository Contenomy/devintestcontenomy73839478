namespace Contenomy.API.Models.DTO.Mangopay
{
	public class QuoteDTO
	{
		
		public DebitedFunds DebitedFunds { get; set; }
		public CreditedFunds CreditedFunds { get; set; }
		public Fees Fees { get; set; }
		public int Duration { get; set; }
		public string Tag { get; set; }

		
	}
}
