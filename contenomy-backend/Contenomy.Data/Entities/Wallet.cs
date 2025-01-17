using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Contenomy.Data.Entities
{
    public class Wallet : EntityBase
    {
        [Required]
        public string UserId { get; set; }

        public ContenomyUser User { get; set; }

        [Required]
        public decimal AvailableBalance { get; set; }

        public ICollection<WalletEntry> WalletEntries { get; set; } = new List<WalletEntry>();
    }
}
