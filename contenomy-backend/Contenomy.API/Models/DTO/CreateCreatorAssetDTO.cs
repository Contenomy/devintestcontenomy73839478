namespace Contenomy.API.Models.DTO
{	public class CreatorAssetDTO
	{
		public int Id { get; set; }
		public string CreatorId { get; set; }
		public int TotalQuantity { get; set; }
		public int AvailableQuantity { get; set; }
		public decimal CurrentValue { get; set; }
		public DateTime StartDate { get; set; }
		public string Status { get; set; }
	}

	public class CreateCreatorAssetDTO
	{
		public string CreatorId { get; set; }
		public int TotalQuantity { get; set; }
		public decimal InitialValue { get; set; }
	}

	public class UpdateValueDTO
	{
		public decimal NewValue { get; set; }
	}
}