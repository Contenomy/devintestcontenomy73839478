namespace Contenomy.API.Models.DTO.Mangopay
{
	
		public class InstantConversionWalletDTO
		{
			public string AuthorId { get; set; }
			public string DebitedWalletId { get; set; }
			public string CreditedWalletId { get; set; }
			public DebitedFunds DebitedFunds { get; set; }
			public CreditedFunds CreditedFunds { get; set; }
			public Fees Fees { get; set; }
			public string Tag { get; set; }

		}


	
}
