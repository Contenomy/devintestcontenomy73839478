using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Contenomy.Shared.Extensions
{
	#region WebApplicationBuilder Extensions
	public static class ConfigureServices
	{
		private const string DEFAULT_APPLICATION_NAME = "Contenomy";
		private const string CONTENOMY_POLICY_NAME = "Contenomy";

		public static void AddContenomyAuthentication(this WebApplicationBuilder builder, IConfiguration configuration, bool automaticKeyGeneration = false)
		{
			if (builder == null)
			{
				throw new ArgumentNullException(nameof(builder));
			}

			//builder.Services.AddAuthentication();

			builder.Services.AddIdentity<ContenomyUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
				.AddEntityFrameworkStores<ContenomyDbContext>();

			var dataProtectionBuilder = builder.Services.AddDataProtection()
				.PersistKeysToDbContext<ContenomyDbContext>()
				.SetApplicationName(configuration["App"] ?? DEFAULT_APPLICATION_NAME);
			if (!automaticKeyGeneration)
			{
				dataProtectionBuilder
					.DisableAutomaticKeyGeneration();
			}

			builder.Services.ConfigureApplicationCookie(options =>
			{
				options.Cookie.Name = ".Contenomy.Auth";
				options.Cookie.Domain = configuration["Auth:Domain"];

				options.Cookie.HttpOnly = false;

				options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
				options.Cookie.SameSite = SameSiteMode.None;

				options.ExpireTimeSpan = TimeSpan.FromDays(365); //per quanto tempo salva le credenziali di login nei cookie

				options.Events.OnRedirectToLogin = context =>
				{
					context.Response.StatusCode = StatusCodes.Status401Unauthorized;
					return Task.CompletedTask;
				};
				options.SlidingExpiration = true;
			});

			builder.Services.AddAuthorization();
		}

		public static void AddContenomyCors(this WebApplicationBuilder builder)
		{
			if (builder == null)
			{
				throw new ArgumentNullException(nameof(builder));
			}

			var configuration = builder.Configuration;

			builder.Services.AddCors(options =>
			{
				options.AddPolicy(CONTENOMY_POLICY_NAME, policy =>
				{
					policy
						.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>())
						.AllowAnyMethod()
						.AllowAnyHeader()
						.AllowCredentials();
				});
			});
		}
		#endregion

		#region WebApplication Extensions
		public static void ConfigureErrorHandling(this WebApplication app)
		{
			if (!app.Environment.IsProduction())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}
		}


		public static void UseContenomyAuthentication(this WebApplication app)
		{
			if (app == null)
			{
				throw new ArgumentNullException(nameof(app));
			}

			app.UseAuthentication();
			app.UseAuthorization();
		}

		public static void UseContenomyCors(this WebApplication app)
		{
			if (app == null)
			{
				throw new ArgumentNullException(nameof(app));
			}

			app.UseCors(CONTENOMY_POLICY_NAME);
		}
		#endregion
	}
}
