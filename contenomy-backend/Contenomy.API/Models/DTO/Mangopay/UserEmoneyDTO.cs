namespace Contenomy.API.Models.DTO.Mangopay
{

	// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
	public class CreditedEMoney
	{
		public string Currency { get; set; }
		public int Amount { get; set; }
	}

	public class DebitedEMoney
	{
		public string Currency { get; set; }
		public int Amount { get; set; }
	}

	public class UserEmoneyDTO
	{
		public string UserId { get; set; }
		public CreditedEMoney CreditedEMoney { get; set; }
		public DebitedEMoney DebitedEMoney { get; set; }
	}


}
