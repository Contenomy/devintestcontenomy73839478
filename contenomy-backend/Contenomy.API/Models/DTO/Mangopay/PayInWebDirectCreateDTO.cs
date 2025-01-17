namespace Contenomy.API.Models.DTO.Mangopay
{
	
	public class PayInWebDirectCreateDTO
	{
		public string Tag { get; set; }
		public string AuthorId { get; set; }
		public string CreditedUserId { get; set; }
		public DebitedFunds DebitedFunds { get; set; }
		public Fees Fees { get; set; }
		public string CreditedWalletId { get; set; }
		public string ReturnURL { get; set; }
		public string TemplateURLOptions { get; set; }
		public string CardType { get; set; }
		public string Culture { get; set; }
		public string SecureMode { get; set; }
		public Billing Billing { get; set; }
		public Shipping Shipping { get; set; }
		public string StatementDescriptor { get; set; }

	}


}
