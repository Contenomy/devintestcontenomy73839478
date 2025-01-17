using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SysJsonIgnore = System.Text.Json.Serialization.JsonIgnoreAttribute;

namespace Contenomy.Data.Entities
{
    public class Ratings : EntityBase
    {
        // FK: Identificatore dell'utente che ha creato il rating
        [Required]
        public string UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        [JsonIgnore]
        [SysJsonIgnore]
        public ContenomyUser User { get; set; }  // Utente che ha creato il rating


        // valore del rating attribuito dall'utente
        [Required]
        public int Value { get; set; }

        // feedback inserito dall'utente
        public string Feedback { get; set; }

        // Data e ora dell'inserimento del rating/feedback
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;  // Imposta automaticamente alla creazione


    }
}
/*
Questo file definisce l'entità Rating che registra i valore attributio dall'utente (da 0 a 5) ed il relativo feedback testuale.
Ogni record include il timestamp,il valore e il feedback (non obbligatorio).
*/