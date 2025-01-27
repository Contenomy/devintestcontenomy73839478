using Contenomy.API.Services;
using Contenomy.API.Services.Background;
using Contenomy.API.Shared.Initializers;
using Contenomy.Data;
using Contenomy.Data.Entities;
using Contenomy.Shared.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Contenomy.API.Models;
using Contenomy.Data.Influx;

namespace Contenomy.API
{
    /*
     * SUMMARY: in linea di massima buon lavoro.
     * Devi ricordarti alcune cose (ModelState.IsValid devi controllarlo DOPO aver chiamato TryValidateModel).
     * Lavora per� sulle ripetizioni di codice: meno ripetizioni ci sono, pi� il codice � mantenibile (non penso
     * tu abbia voglia quando lavori sul backend di andare a cercare gli stessi pezzi di codice perch� hai fatto
     * una modifica in uno)
     * Ho sparso dei commenti qua e l�:
     * - TIP: sono consigli
     * - Q&A: sono mie domande per te
     * - FACT: sono osservazioni obiettive sul codice
     */
    public class Program
    {
        public static void Main(string[] args)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            var builder = WebApplication.CreateBuilder(args);

            // Configurazione di Serilog
            builder.Host.UseSerilog();
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .CreateLogger();

            // Configurazione dei servizi
            builder.Services.AddControllers()
                .AddNewtonsoftJson()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
                })
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.SuppressModelStateInvalidFilter = true;
                });

            builder.Services.AddDbContext<ContenomyDbContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.AddContenomyAuthentication(builder.Configuration, true);

            builder.Services.AddScoped((serviceProvider) =>
            {
                var config = serviceProvider.GetRequiredService<IConfiguration>().GetSection("InfluxConfig");

                return new InfluxService(config["Token"], config["Server"], config["Bucket"], config["Org"]);
            });

            // CORS configuration
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", builder =>
                {
                    builder.WithOrigins("http://localhost:3000")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials()
                           .SetIsOriginAllowed(_ => true);
                });
            });

            // Optionally, add a service to handle Mangopay API calls

            builder.Services.AddScoped<OrderBookService>();
            builder.Services.AddScoped<OrderMatchingService>();
            builder.Services.AddScoped<WalletService>();
            builder.Services.AddScoped<ShopService>();
            builder.Services.AddHostedService<OrderMatchingBackgroundService>();
            builder.Services.AddScoped<MangoPayService>();
            builder.Services.AddHttpClient();

            var app = builder.Build();

            // Inizializzazione del database e dei ruoli
            using (var scopedServiceProvider = app.Services.CreateScope())
            {
                using var db = scopedServiceProvider.ServiceProvider.GetRequiredService<ContenomyDbContext>();
                using var userManager = scopedServiceProvider.ServiceProvider.GetRequiredService<UserManager<ContenomyUser>>();
                DBInitializer.InitializeContenomyDb(db);
                DBInitializer.AddRoles(scopedServiceProvider.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>()).Wait();
                if (app.Environment.IsDevelopment())
                {
                    var influxService = scopedServiceProvider.ServiceProvider.GetRequiredService<InfluxService>();
                    DBInitializer.InitializeTestEnvironment(db, userManager, influxService).Wait();
                    DBInitializer.AddDeveloper(userManager).Wait();
                }
            }

            app.ConfigureErrorHandling();
            app.UseContenomyCors();


            // Configurazione del pipeline HTTP
            app.UseRouting();

            // Utilizzo della policy CORS aggiornata
            //app.UseCors("AllowReactApp");

            app.UseContenomyAuthentication();
            app.UseAuthorization();

            app.UseCors(builder =>
            {
                builder.WithOrigins("http://localhost:3000")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials()
                       .SetIsOriginAllowed(_ => true);
            });

            app.MapControllers();

            app.Run();
        }
    }
}
