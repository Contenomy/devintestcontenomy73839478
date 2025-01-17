using Contenomy.Data.Entities;

namespace Contenomy.API.Models.DTO
{
    public class PlaceOrderDTO
    {
        public int CreatorAssetId { get; set; }
        public string Type { get; set; }
        public string Direction { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}