using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contenomy.Data.Entities
{
    public class PersonalData : EntityBase
    {
		public string? UserId { get; set; }

		public string? Name { get; set; }

		public string? Surname { get; set; }

		public char? Gender { get; set; }

		public string? BirthDate { get; set; }

		public string? Nationality { get; set; }

		public string? BirthCity { get; set; }

		public string? BirthNation { get; set; }

		public string? CodiceFiscale { get; set; }

		public string? ResidenceCity { get; set; }

		public string? ResidenceCountry { get; set; }

		public string? CAP { get; set; }

		public string? Address { get; set; }

		public string? MangpayUserId { get; set; }
		public string? MangopayWalletId { get; set; }
		
	}
}
