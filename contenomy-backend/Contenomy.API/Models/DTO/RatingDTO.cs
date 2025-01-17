using System.Collections.Generic;

namespace Contenomy.API.Models.DTO
{
    public class RatingDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int Value { get; set; }
        public string Feedback { get; set; }
        public DateTime Timestamp { get; set; }
       
        
    }
}

// Questi DTO rappresentano il libro degli ordini e i singoli ordini per un creator asset.
// OrderDTO include ora l'Id dell'ordine, il CreatorAssetId, e l'UserId per identificare chi ha piazzato l'ordine.