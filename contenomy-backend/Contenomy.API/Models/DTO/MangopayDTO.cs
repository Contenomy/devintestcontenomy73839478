

namespace Contenomy.API.Models.DTO
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

	public class UserNaturalCreateDTO
	{
		public Address? Address { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public int? Birthday { get; set; }
		public string? Nationality { get; set; }
		public string? CountryOfResidence { get; set; }
		public string? Occupation { get; set; }
		public int? IncomeRange { get; set; }
		public string? Tag { get; set; }
		public string Email { get; set; }
		public bool TermsAndConditionsAccepted { get; set; }
		public string UserCategory { get; set; }
	}

	
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

	public class LegalUserCreateDTO
	{
		public HeadquartersAddress HeadquartersAddress { get; set; }
		public LegalRepresentativeAddress LegalRepresentativeAddress { get; set; }
		public string Name { get; set; }
		public string LegalPersonType { get; set; }
		public string LegalRepresentativeFirstName { get; set; }
		public string LegalRepresentativeLastName { get; set; }
		public string LegalRepresentativeEmail { get; set; }
		public int LegalRepresentativeBirthday { get; set; }
		public string LegalRepresentativeNationality { get; set; }
		public string LegalRepresentativeCountryOfResidence { get; set; }
		public string CompanyNumber { get; set; }
		public string Tag { get; set; }
		public string Email { get; set; }
		public bool TermsAndConditionsAccepted { get; set; }
		public string UserCategory { get; set; }
	}

	

    public class WalletCreateDTO
    {
        public string[] Owners { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
    }

    public class TransferCreateDTO
    {
        public string AuthorId { get; set; }
        public string CreditedUserId { get; set; }
        public string DebitedWalletId { get; set; }
        public string CreditedWalletId { get; set; }
        public MoneyDTO DebitedFunds { get; set; }
        public MoneyDTO Fees { get; set; }
    }

    public class MoneyDTO
    {
        public int Amount { get; set; } // Example: 1000 for 10.00 EUR
        public string Currency { get; set; } // Example: EUR
    }

    public class CardRegistrationCreateDTO
    {
		public string Tag { get; set; }
		public string UserId { get; set; }
        public string Currency { get; set; }
        public string CardType { get; set; } // Example: CB_VISA_MASTERCARD
    }

public class TokenizeCardDTO
    {
		
		public string cardRegistrationUrl { get; set; }
		public string accessKeyRef { get; set; }
        public string data { get; set; }
        public string cardNumber { get; set; } 
		public string cardExpirationDate { get; set; } 
		public string cardCvx { get; set; } 
	}


    public class PayoutCreateDTO
    {
        public string AuthorId { get; set; }
        public string DebitedWalletId { get; set; }
        public MoneyDTO DebitedFunds { get; set; }
        public MoneyDTO Fees { get; set; }
        public string BankAccountId { get; set; }
        public string BankWireRef { get; set; }
    }

    public class KycDocumentCreateDTO
    {
        public string Tag { get; set; }
        public string Type { get; set; } // Example: IDENTITY_PROOF, ADDRESS_PROOF
    }

}
