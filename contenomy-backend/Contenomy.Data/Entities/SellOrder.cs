using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class SellOrder : Order
    {
        // FK: Identificatore del creator (popolato solo se è un creator ad aver immesso SupportShare)
        public string? CreatorId { get; set; }

        [ForeignKey(nameof(CreatorId))]
        public ContenomyUser? Creator { get; set; }

        // Indica se il venditore è un 'creator' o un 'follower'
        public UserType UserType { get; set; }
    }

    public enum UserType
    {
        Creator,
        Follower
    }
}

// Questa classe rappresenta un ordine di vendita, estendendo la classe base Order.
// Include campi aggiuntivi specifici per gli ordini di vendita, come l'identificatore
// del creator e il tipo di utente che sta vendendo.