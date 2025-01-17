using Contenomy.Data.Enums;

namespace Contenomy.API.Shared.DTO
{
    public sealed class PurchaseDTO
    {
        public int ActionId { get; set; }

        public double Amount { get; set; }

        public double Price { get; set; }
    }
}
