using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class CreatorAsset : EntityBase
    {
        [Required]
        public string CreatorId { get; set; }

        [ForeignKey("CreatorId")]
        public ContenomyUser Creator { get; set; }

        [Required]
        public int TotalQuantity { get; set; }

        [Required]
        public int AvailableQuantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentValue { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        public CreatorAssetStatus Status { get; set; }

        public IPO? IPO { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();

        public ICollection<WalletEntry> WalletEntries { get; set; } = new List<WalletEntry>();

        public ICollection<PriceHistory> PriceHistories { get; set; } = new List<PriceHistory>();

        public string? Description { get; set; }
    }

    public enum CreatorAssetStatus
    {
        Active,
        Suspended,
        Closed
    }
}
