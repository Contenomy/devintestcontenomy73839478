using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class PriceHistory : EntityBase
    {
        // FK: Identificatore del CreatorAsset associato
        [Required]
        public int CreatorAssetId { get; set; }

        [ForeignKey(nameof(CreatorAssetId))]
        public CreatorAsset? CreatorAsset { get; set; }  // Associazione al CreatorAsset

        // Data e ora del record di prezzo
        [Required]
        public DateTime Timestamp { get; set; }

        // Prezzo del CreatorAsset in quel momento
        [Required]
        [Column(TypeName = "decimal(18,8)")]
        public decimal Price { get; set; }

        // Tipo di aggiornamento del prezzo
        [Required]
        public PriceUpdateType UpdateType { get; set; }
    }

    public enum PriceUpdateType
    {
        Transaction,
        PeriodicUpdate
    }
}

/*
Questo file definisce l'entità PriceHistory che registra lo storico dei prezzi per ogni CreatorAsset.
Ogni record include il timestamp, il prezzo e il tipo di aggiornamento (se dovuto a una transazione o a un aggiornamento periodico).
L'entità è associata al CreatorAsset tramite una relazione di chiave esterna.
L'enum PriceUpdateType permette di distinguere tra aggiornamenti dovuti a transazioni effettive e aggiornamenti periodici.
*/
