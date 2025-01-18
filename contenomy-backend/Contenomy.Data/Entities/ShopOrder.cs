using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class ShopOrder : EntityBase
    {
        [Required]
        public string BuyerId { get; set; }

        [ForeignKey(nameof(BuyerId))]
        public ContenomyUser Buyer { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public ShopProduct Product { get; set; }

        [Required]
        public string CreatorId { get; set; }

        [ForeignKey(nameof(CreatorId))]
        public ContenomyUser Creator { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        public ShopOrderStatus Status { get; set; } = ShopOrderStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }

    public enum ShopOrderStatus
    {
        Pending,
        Processing,
        Completed,
        Cancelled,
        Failed
    }
}
