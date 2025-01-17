namespace Contenomy.API.Models.DTO.Mangopay
{
	public class OwnerAddress
	{
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string Region { get; set; }
		public string PostalCode { get; set; }
		public string Country { get; set; }

	}
	public class BanckAccountDTOca
	{
		public OwnerAddress OwnerAddress { get; set; }
		public string AccountNumber { get; set; }
		public string InstitutionNumber { get; set; }
		public string BranchCode { get; set; }
		public string BankName { get; set; }
		public string OwnerName { get; set; }
		public string Tag { get; set; }

	}
}
