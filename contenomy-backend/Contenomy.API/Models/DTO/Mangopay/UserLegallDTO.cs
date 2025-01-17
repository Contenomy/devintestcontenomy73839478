namespace Contenomy.API.Models.DTO.Mangopay
{

	// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
	public class HeadquartersAddress
	{
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string Region { get; set; }
		public string PostalCode { get; set; }
		public string Country { get; set; }
	}

	public class LegalRepresentativeAddress
	{
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string Region { get; set; }
		public string PostalCode { get; set; }
		public string Country { get; set; }
	}

	public class UserLegalDTO
	{
		public HeadquartersAddress HeadquartersAddress { get; set; }
		public LegalRepresentativeAddress LegalRepresentativeAddress { get; set; }
		public string Name { get; set; }
		public string LegalPersonType { get; set; }
		public string LegalRepresentativeFirstName { get; set; }
		public string LegalRepresentativeLastName { get; set; }
		public string LegalRepresentativeEmail { get; set; }
		public object LegalRepresentativeBirthday { get; set; }
		public string LegalRepresentativeNationality { get; set; }
		public string LegalRepresentativeCountryOfResidence { get; set; }
		public object ProofOfRegistration { get; set; }
		public object ShareholderDeclaration { get; set; }
		public object Statute { get; set; }
		public object LegalRepresentativeProofOfIdentity { get; set; }
		public object CompanyNumber { get; set; }
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
