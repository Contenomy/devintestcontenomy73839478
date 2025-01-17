namespace Contenomy.API.Models.DTO.Mangopay
{
	
		public class InstantConversionClientDTO
		{
		
			public string DebitedWalletType { get; set; }
			public DebitedFunds DebitedFunds { get; set; }
			public string CreditedWalletType { get; set; }
			public CreditedFunds CreditedFunds { get; set; }
			public string Tag { get; set; }

		}

}
