namespace Contenomy.API.Models.DTO.Mangopay
{
	
	public class Address
	{
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string Region { get; set; }
		public string PostalCode { get; set; }
		public string Country { get; set; }
	}

	public class UserNaturalDTO
	{
		public Address Address { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public object Birthday { get; set; }
		public string Nationality { get; set; }
		public string CountryOfResidence { get; set; }
		public string Occupation { get; set; }
		public object IncomeRange { get; set; }
		public object ProofOfIdentity { get; set; }
		public object ProofOfAddress { get; set; }
		public string Capacity { get; set; }
		public string Id { get; set; }
		public string Tag { get; set; }
		public object CreationDate { get; set; }
		public string PersonType { get; set; }
		public string Email { get; set; }
		public string KYCLevel { get; set; }
		public bool TermsAndConditionsAccepted { get; set; }
		public object TermsAndConditionsAcceptedDate { get; set; }
		public string UserCategory { get; set; }
		public string UserStatus { get; set; }
	}
}
