using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class WalletEntry : EntityBase
    {
        public int CreatorAssetId { get; set; }

        [ForeignKey(nameof(CreatorAssetId))]
        public CreatorAsset? CreatorAsset { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AveragePrice { get; set; }

        public int Quantity { get; set; }

        public int WalletId { get; set; }

        [ForeignKey(nameof(WalletId))]
        public Wallet? Wallet { get; set; }
    }
}
