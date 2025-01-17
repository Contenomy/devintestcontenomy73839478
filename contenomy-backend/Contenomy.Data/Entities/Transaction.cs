using Contenomy.Data.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
	public class Transaction : EntityBase
	{
		public string Issuer { get; set; }
		public double Amount { get; set; }
		public TransactionType Type { get; set; }
		public TransactionStatus Status { get; set; }

		public string Beneficiary { get; set; }

		public int CreatorAssetId { get; set; }

		[ForeignKey(nameof(CreatorAssetId))]
		public CreatorAsset? CreatorAsset {  get; set; }

		public int? WalletEntryId {  get; set; }
		[ForeignKey(nameof(WalletEntryId))]
		public WalletEntry? WalletEntry { get; set; }
	}
}
