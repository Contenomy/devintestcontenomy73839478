namespace Contenomy.API.Models.DTO.Mangopay
{
	public class CardRegistrationDTO
	{		
			public string Id { get; set; }
			public object Tag { get; set; }
			public int CreationDate { get; set; }
			public string UserId { get; set; }
			public string AccessKey { get; set; }
			public string PreregistrationData { get; set; }
			public object RegistrationData { get; set; }
			public object CardId { get; set; }
			public string CardType { get; set; }
			public string CardRegistrationURL { get; set; }
			public object ResultCode { get; set; }
			public object ResultMessage { get; set; }
			public string Currency { get; set; }
			public string Status { get; set; }
		
	}
}
