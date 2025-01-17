namespace Contenomy.Data.Entities
{
    public class BuyOrder : Order
    {
        // Prezzo massimo che l'acquirente è disposto a pagare (per ordini limite)
        public decimal MaxPrice { get; set; }
    }
}

// Questa classe rappresenta un ordine di acquisto, estendendo la classe base Order.
// Include un campo aggiuntivo per il prezzo massimo che l'acquirente è disposto a pagare.