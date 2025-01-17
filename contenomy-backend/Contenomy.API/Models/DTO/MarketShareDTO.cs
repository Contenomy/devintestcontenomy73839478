namespace Contenomy.API.Models.DTO
{
    public class MarketShareDTO
    {
        public int Id { get; set; }
        public double MarketCap { get; set; }
        public double Price { get; set; }
        public required string Name { get; set; }
        public double Trend { get; set; }
    }
}

// Commento: Questo DTO rappresenta i dati di una quota di mercato di un creator.