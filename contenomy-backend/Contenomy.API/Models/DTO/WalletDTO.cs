namespace Contenomy.API.Models.DTO
{
    public class WalletEntryDTO
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal CurrentValue { get; set; }
        public string CreatorNickname { get; set; }
    }

    public class SellDataDTO
    {
        public int WalletEntryId { get; set; }
        public int Amount { get; set; }
        public decimal? SellPrice { get; set; }
    }
}