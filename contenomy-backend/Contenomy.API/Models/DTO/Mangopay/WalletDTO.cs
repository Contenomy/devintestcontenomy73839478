namespace Contenomy.API.Models.DTO.Mangopay
{
	



	public class Balance
	{
		public string Currency { get; set; }
		public int Amount { get; set; }
	}

	public class WalletDTO
	{
		public string Description { get; set; }
		public List<string> Owners { get; set; }
		public string Id { get; set; }
		public Balance Balance { get; set; }
		public string Currency { get; set; }
		public string FundsType { get; set; }
		public string Tag { get; set; }
		public int CreationDate { get; set; }
	}
}
