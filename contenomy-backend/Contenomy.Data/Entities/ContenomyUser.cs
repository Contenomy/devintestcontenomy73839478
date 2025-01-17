using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Contenomy.Data.Entities
{
    public class ContenomyUser : IdentityUser
    {
        public string? Nickname { get; set; }

        public Wallet? Wallet { get; set; }  // Wallet associato all'utente

        // Relazione uno-a-molti con i CreatorAsset creati dall'utente
        public ICollection<CreatorAsset> CreatorAssets { get; set; } = new List<CreatorAsset>();

        // Relazione uno-a-molti con gli ordini creati dall'utente
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}

/*
Questo codice definisce la classe ContenomyUser, che estende IdentityUser per rappresentare gli utenti della piattaforma Contenomy.
Queste aggiunte permettono di tracciare gli asset creati dai creator e gestire gli ordini eseguiti dagli utenti.
*/
