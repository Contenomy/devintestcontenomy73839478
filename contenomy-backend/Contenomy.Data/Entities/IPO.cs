using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class IPO : EntityBase
    {
        [Required]
        public string CreatorId { get; set; }

        [ForeignKey("CreatorId")]
        public ContenomyUser Creator { get; set; }

        [Required]
        public int CreatorAssetId { get; set; }

        [ForeignKey("CreatorAssetId")]
        public CreatorAsset CreatorAsset { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public int InitialQuantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal InitialPrice { get; set; }

        public IPOStatus Status { get; set; }
    }

    public enum IPOStatus
    {
        Pending,
        Active,
        Completed,
        Cancelled
    }
}

/*
Questo codice definisce la classe IPO (Initial Public Offering)  r appresenta l'offerta pubblica iniziale 
di SupportShare per un creator specifico.
La classe IPO include:
- Riferimenti al Creator e al CreatorAsset associati
- La data di inizio dell'IPO
- La quantità iniziale di SupportShare offerte (sempre impostata a 1000)
- Il prezzo iniziale delle SupportShare (sempre >1,50€, inizialmente impostato a 2€)
- Lo stato corrente dell'IPO

Questa struttura permette di gestire il processo di lancio iniziale delle SupportShare di un creator,
tracciando informazioni cruciali come la quantità, il prezzo e lo stato dell'offerta.
*/