namespace Contenomy.API.Models.DTO.Mangopay
{
	public class KeyDocumentDTO
	{
		public string Type { get; set; }
		public string UserId { get; set; }
		public List<object> Flags { get; set; }
		public string Id { get; set; }
		public string Tag { get; set; }
		public int CreationDate { get; set; }
		public object ProcessedDate { get; set; }
		public string Status { get; set; }
		public object RefusedReasonType { get; set; }
		public object RefusedReasonMessage { get; set; }
	}

}
