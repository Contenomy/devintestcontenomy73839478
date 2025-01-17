using System.Collections.Generic;

namespace Contenomy.API.Models.DTO
{
    public class OrderBookDTO
    {
        public List<OrderDTO> BuyOrders { get; set; } = new List<OrderDTO>();
        public List<OrderDTO> SellOrders { get; set; } = new List<OrderDTO>();
    }

    public class OrderDTO
    {
        public int Id { get; set; }
        public int CreatorAssetId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Total { get; set; }
        public string UserId { get; set; }
    }
}

// Questi DTO rappresentano il libro degli ordini e i singoli ordini per un creator asset.
// OrderDTO include ora l'Id dell'ordine, il CreatorAssetId, e l'UserId per identificare chi ha piazzato l'ordine.