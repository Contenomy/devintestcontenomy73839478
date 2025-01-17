using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Contenomy.API.Shared.Initializers
{
    public static class DBInitializer
    {
        public static void InitializeContenomyDb(ContenomyDbContext dbContext)
        {
            if (dbContext == null)
            {
                throw new ArgumentNullException(nameof(dbContext));
            }

            if (dbContext.Database.GetPendingMigrations().Any())
            {
                dbContext.Database.Migrate();
            }
        }

        public static async Task InitializeTestEnvironment(ContenomyDbContext dbContext, UserManager<ContenomyUser> userManager)
        {
            if (dbContext == null)
            {
                throw new ArgumentNullException(nameof(dbContext));
            }

            if (userManager == null)
            {
                throw new ArgumentNullException(nameof(userManager));
            }

            // Dati fittizi per i test
            var users = new[]
            {
                new { Username = "Mario Rossi", IsCreator = true, Value = 5.2, AssetCap = 35 },
                new { Username = "Luca Verdi", IsCreator = true, Value = 3.7, AssetCap = 20 },
                new { Username = "Marco Brandi", IsCreator = false, Value = 0D, AssetCap = 0 },
                new { Username = "Giuseppe Neri", IsCreator = true, Value = 4.8, AssetCap = 28 },
                new { Username = "Elisa Rossi", IsCreator = true, Value = 7.1, AssetCap = 45 },
                new { Username = "Franco Blu", IsCreator = true, Value = 2.9, AssetCap = 20 },
                new { Username = "Sabrina Verdi", IsCreator = true, Value = 6.5, AssetCap = 50 },
                new { Username = "Giulia Bianchi", IsCreator = true, Value = 5.9, AssetCap = 40 },
                new { Username = "Carlo Gialli", IsCreator = true, Value = 3.4, AssetCap = 25 },
                new { Username = "Martina Neri", IsCreator = true, Value = 7.8, AssetCap = 55 },
                new { Username = "Luca Grigi", IsCreator = true, Value = 4.2, AssetCap = 30 },
                new { Username = "Alessandro Verdi", IsCreator = true, Value = 6.0, AssetCap = 42 },
                new { Username = "Beatrice Rossi", IsCreator = true, Value = 3.1, AssetCap = 18 },
                new { Username = "Simone Blu", IsCreator = true, Value = 5.4, AssetCap = 37 },
                new { Username = "Lucia Bianchi", IsCreator = true, Value = 6.3, AssetCap = 48 },
                new { Username = "Davide Rossi", IsCreator = true, Value = 4.9, AssetCap = 33 },
                new { Username = "Federico Neri", IsCreator = true, Value = 7.2, AssetCap = 52 },
                new { Username = "Valentina Gialli", IsCreator = true, Value = 5.7, AssetCap = 39 },
                new { Username = "Paolo Verdi", IsCreator = true, Value = 3.8, AssetCap = 22 },
                new { Username = "Chiara Rossi", IsCreator = true, Value = 6.9, AssetCap = 47 },
                new { Username = "Marta Bianchi", IsCreator = true, Value = 5.0, AssetCap = 34 },
                new { Username = "Marco Grigi", IsCreator = true, Value = 4.4, AssetCap = 26 },
                new { Username = "Ilaria Blu", IsCreator = true, Value = 6.6, AssetCap = 49 }
            };

            foreach (var user in users)
            {
                var username = user.Username.Replace(' ', '.');
                var contenomyUser = await userManager.FindByNameAsync(username);

                if (contenomyUser == null)
                {
                    contenomyUser = new ContenomyUser
                    {
                        UserName = username,
                        Nickname = user.Username
                    };

                    var result = await userManager.CreateAsync(contenomyUser, $"{contenomyUser.UserName}01!");
                }

                if (user.IsCreator)
                {
                    await AddClaim(contenomyUser, userManager, "SocialRole", "Creator");
                    await CreateAsset(dbContext, contenomyUser, user.AssetCap, user.Value);
                }
                else
                {
                    await AddClaim(contenomyUser, userManager, "SocialRole", "Follower");
                }
            }

            await dbContext.SaveChangesAsync();
        }

        private static async Task CreateAsset(ContenomyDbContext dbContext, ContenomyUser contenomyUser, int cap, double value)
        {
            var asset = await dbContext.CreatorAssets.FirstOrDefaultAsync(a => a.CreatorId == contenomyUser.Id);

            if (asset == null)
            {
                asset = new CreatorAsset
                {
                    Creator = contenomyUser,
                    TotalQuantity = 1000,
                    AvailableQuantity = 1000,
                    CurrentValue = (decimal)value
                };

                dbContext.CreatorAssets.Add(asset);
                await dbContext.SaveChangesAsync();

                // Crea una IPO per questo asset
                var ipoStartDate = new DateTime(2024, 8, 29);
                var ipo = new IPO
                {
                    Creator = contenomyUser,
                    CreatorAsset = asset,
                    StartDate = ipoStartDate,
                    InitialQuantity = 1000,
                    InitialPrice = 2m,  // 2€
                    Status = IPOStatus.Active
                };

                dbContext.IPOs.Add(ipo);

                // Crea un ordine di vendita per tutte le SupportShare disponibili
                var sellOrder = new Order
                {
                    CreatorAsset = asset,
                    User = contenomyUser,
                    Creator = contenomyUser,
                    Type = OrderType.Limit,
                    Direction = OrderDirection.Sell,
                    Price = ipo.InitialPrice,
                    Quantity = ipo.InitialQuantity,
                    CreatedAt = ipoStartDate,
                    Status = OrderStatus.Pending
                };

                dbContext.Orders.Add(sellOrder);
                await dbContext.SaveChangesAsync();
            }
            else
            {
                asset.TotalQuantity = 1000;
                asset.AvailableQuantity = 1000;
                asset.CurrentValue = (decimal)value;
            }
        }

        public static async Task AddRoles(RoleManager<IdentityRole> roleManager)
        {
            if (roleManager == null)
            {
                throw new ArgumentNullException(nameof(roleManager));
            }

            var roles = new[] { "None", "Guest", "Maintainer", "Admin", "Developer" };

            foreach (var role in roles)
            {
                if (await roleManager.RoleExistsAsync(role))
                {
                    continue;
                }

                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        public static async Task AddDeveloper(UserManager<ContenomyUser> userManager)
        {
            var user = await userManager.FindByNameAsync("DEVELOPER");
            if (user != null)
            {
                await AddClaim(user, userManager, "AccessLevel", "DEVELOPER");
                return;
            }

            user = new ContenomyUser
            {
                UserName = "DEVELOPER",
                EmailConfirmed = true,
                Email = "developer@contenomy.com"
            };

            if ((await userManager.CreateAsync(user, "C0nT_D3v_2023!")).Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Developer");
                await AddClaim(user, userManager, "AccessLevel", "DEVELOPER");
            }
        }

        private static async Task AddClaim(ContenomyUser user, UserManager<ContenomyUser> userManager, string claimType, string claimValue)
        {
            var claims = await userManager.GetClaimsAsync(user);
            var accessLevelClaim = claims.FirstOrDefault(f => f.Type == claimType);

            if (accessLevelClaim != null)
            {
                return;
            }

            await userManager.AddClaimAsync(user, new Claim(claimType, claimValue));
        }
    }
}
