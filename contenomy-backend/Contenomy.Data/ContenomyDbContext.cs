using Contenomy.Data.Entities;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.Data
{
    public class ContenomyDbContext : IdentityDbContext<ContenomyUser>, IDataProtectionKeyContext
    {
        public ContenomyDbContext()
        {
        }

        public ContenomyDbContext(DbContextOptions<ContenomyDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Database=contenomy;Username=postgres;Password=iot");
            }
            optionsBuilder.EnableSensitiveDataLogging();
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Ignore<EntityBase>();
            base.OnModelCreating(builder);

            builder.Entity<ContenomyUser>(entity =>
            {
                entity.HasOne(user => user.Wallet)
                    .WithOne(wallet => wallet.User)
                    .HasPrincipalKey<ContenomyUser>(user => user.Id)
                    .HasForeignKey<Wallet>(wallet => wallet.UserId);
            });

            builder.Entity<CreatorAsset>(entity =>
            {
                entity.HasOne(asset => asset.Creator)
                    .WithMany(creator => creator.CreatorAssets)
                    .HasForeignKey(asset => asset.CreatorId);

                entity.HasOne(asset => asset.IPO)
                    .WithOne(ipo => ipo.CreatorAsset)
                    .HasForeignKey<IPO>(ipo => ipo.CreatorAssetId);

                // Definisci la relazione con PriceHistories correttamente
                entity.HasMany(asset => asset.PriceHistories)
                    .WithOne(ph => ph.CreatorAsset)
                    .HasForeignKey(ph => ph.CreatorAssetId);

                // Definisci la relazione con Orders correttamente
                entity.HasMany(asset => asset.Orders)
                    .WithOne(order => order.CreatorAsset)
                    .HasForeignKey(order => order.CreatorAssetId);
            });

            builder.Entity<Order>(entity =>
            {
                entity.HasOne(order => order.CreatorAsset)
                    .WithMany(asset => asset.Orders)
                    .HasForeignKey(order => order.CreatorAssetId);

                entity.HasOne(order => order.User)
                    .WithMany(user => user.Orders)
                    .HasForeignKey(order => order.UserId);
            });

            builder.Entity<WalletEntry>(entity =>
            {
                entity.HasOne(entry => entry.Wallet)
                    .WithMany(wallet => wallet.WalletEntries)
                    .HasForeignKey(entry => entry.WalletId);

                entity.HasOne(entry => entry.CreatorAsset)
                    .WithMany(asset => asset.WalletEntries)
                    .HasForeignKey(entry => entry.CreatorAssetId);
            });

            builder.Entity<PriceHistory>(entity =>
            {
                entity.HasOne(ph => ph.CreatorAsset)
                    .WithMany(ca => ca.PriceHistories)
                    .HasForeignKey(ph => ph.CreatorAssetId);
            });

			builder.Entity<Ratings>(entity =>
			{
				entity.HasOne(r => r.User);
			});

            builder.Entity<ShopProduct>(entity =>
            {
                entity.HasOne(p => p.Creator)
                    .WithMany()
                    .HasForeignKey(p => p.CreatorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<ShopOrder>(entity =>
            {
                entity.HasOne(o => o.Creator)
                    .WithMany()
                    .HasForeignKey(o => o.CreatorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Buyer)
                    .WithMany()
                    .HasForeignKey(o => o.BuyerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.Product)
                    .WithMany()
                    .HasForeignKey(o => o.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
			
		}

        // Definizione dei DbSet per le entità del database
        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
        public DbSet<CreatorAsset> CreatorAssets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<WalletEntry> WalletEntries { get; set; }
        public DbSet<TransactionError> Errors { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<PriceHistory> PriceHistories { get; set; }
        public DbSet<IPO> IPOs { get; set; }
		public DbSet<Ratings> Ratings { get; set; }

		public DbSet<PersonalData> personaldata { get; set; }
		public DbSet<EmailVerificationRequest> EmailVerificationRequests { get; set; }
        public DbSet<ShopProduct> ShopProducts { get; set; }
        public DbSet<ShopOrder> ShopOrders { get; set; }

		// Metodi per la gestione degli errori di transazione
		private TransactionError GenerateTransactionError(int? purchaseId, int? sellId, string error, Exception? ex)
        {
            return new TransactionError
            {
                Exception = ex,
                Error = error,
                SellId = sellId,
                PurchaseId = purchaseId,
            };
        }

        public void InsertTransactionError(int? purchaseId, int? sellId, string error, Exception? ex, bool save = false)
        {
            Errors.Add(GenerateTransactionError(purchaseId, sellId, error, ex));

            if (save)
            {
                SaveChanges();
            }
        }

        public async Task InsertTransactionErrorAsync(int? purchaseId, int? sellId, string error, Exception? ex, bool save = false)
        {
            await Errors.AddAsync(GenerateTransactionError(purchaseId, sellId, error, ex));

            if (save)
            {
                await SaveChangesAsync();
            }
        }
    }
}
