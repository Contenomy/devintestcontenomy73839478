using System;

namespace Contenomy.API.Models.DTO
{
    public class ContentCreatorInfoDTO
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int CreatorAssetId { get; set; }
        public int TotalQuantity { get; set; }
        public int AvailableQuantity { get; set; }
        public decimal CurrentValue { get; set; }
        public DateTime CreatorAssetStartDate { get; set; }
        public DateTime? CreatorAssetEndDate { get; set; }
        public string Description { get; set; }
        public string CreatorAssetStatus { get; set; }
        public DateTime? IPOStartDate { get; set; }
        public decimal InitialPrice { get; set; }
        public string IPOStatus { get; set; }
    }
}