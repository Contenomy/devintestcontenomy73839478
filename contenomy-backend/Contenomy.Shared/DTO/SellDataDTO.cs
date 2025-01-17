using Contenomy.API.Shared.DTO;
using Contenomy.Data.Entities;
using Contenomy.Data.Enums;

namespace Contenomy.API.Models.DTO
{
    public sealed class SellDataDTO
	{
        public SellDataDTO()
        {
        }

        public int WalletEntryId { get; set; }
		public double Amount { get; set; }

		public double? SellPrice { get; set; }
	}
}
