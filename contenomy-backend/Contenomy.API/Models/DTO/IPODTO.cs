namespace Contenomy.API.Models.DTO
{
    public class IPODTO
    {
        public int Id { get; set; }
        public string CreatorId { get; set; }
        public int CreatorAssetId { get; set; }
        public DateTime StartDate { get; set; }
        public int InitialQuantity { get; set; }
        public decimal InitialPrice { get; set; }
        public string Status { get; set; }
    }
	public class CreateIPODTO
	{
		public string CreatorId { get; set; }
		public decimal InitialPrice { get; set; }
		public DateTime StartDate { get; set; }
	}
}