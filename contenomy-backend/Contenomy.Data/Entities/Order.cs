using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SysJsonIgnore = System.Text.Json.Serialization.JsonIgnoreAttribute;

namespace Contenomy.Data.Entities
{
    public class Order : EntityBase
    {
        // FK: Identificatore del CreatorAsset associato all'ordine
        [Required]
        public int CreatorAssetId { get; set; }

        [ForeignKey(nameof(CreatorAssetId))]
        [JsonIgnore]
        [SysJsonIgnore]
        public CreatorAsset CreatorAsset { get; set; }  // Asset associato all'ordine

        // FK: Identificatore dell'utente che ha creato l'ordine
        [Required]
        public string UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        [JsonIgnore]
        [SysJsonIgnore]
        public ContenomyUser User { get; set; }  // Utente che ha creato l'ordine

        // Tipo di ordine ('limite' o 'mercato')
        [Required]
        public OrderType Type { get; set; }

        // Prezzo dell'ordine
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Quantità di CreatorAsset nell'ordine
        [Required]
        public int Quantity { get; set; }

        // Data e ora dell'inserimento dell'ordine
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Imposta automaticamente alla creazione

        // Stato dell'ordine
        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;  // Stato iniziale come pendente

        // Indica se l'ordine è di acquisto o vendita
        [Required]
        public OrderDirection Direction { get; set; }

        // ID del creator se l'ordine è di vendita e il venditore è un creator
        public string? CreatorId { get; set; }

        [ForeignKey(nameof(CreatorId))] 
        [JsonIgnore]
        [SysJsonIgnore]
        public ContenomyUser? Creator { get; set; }  // Creator che ha inserito l'ordine, se applicabile
    }

    public enum OrderType
    {
        Limit,
        Market
    }

    public enum OrderStatus
    {
        Pending,
        Executed,
        Cancelled,
        Expired,
        Suspended
    }

    public enum OrderDirection
    {
        Buy,
        Sell
    }
}

/*
Questo file definisce la classe Order, che rappresenta un ordine generico nel sistema di trading di Contenomy.
La struttura è stata progettata per supportare sia ordini di acquisto che di vendita con una gestione unificata.

La classe include:
- Riferimenti al CreatorAsset e all'utente associati all'ordine
- Tipo di ordine (limite o mercato), prezzo, quantità e timestamp di creazione
- Stato dell'ordine (pendente, eseguito, annullato, ecc.)
- Direzione dell'ordine (acquisto o vendita)
- Riferimento opzionale al creator per gestire ordini di vendita da parte dei creator

Questa configurazione facilita il processo di matching, la gestione del libro ordini e l'integrazione con le altre funzionalità della piattaforma.
*/
