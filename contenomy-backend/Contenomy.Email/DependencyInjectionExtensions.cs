using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Contenomy.Email
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddEmailSender(this IServiceCollection services, string configSectionKey = "EmailSenderConfig")
        {
            services.AddSingleton((serviceProvider) =>
            {
                var configuration = serviceProvider.GetRequiredService<IConfiguration>();

                var configSection = configuration.GetRequiredSection(configSectionKey).Get<EmailServerConfiguration>()!;

                return new EmailSender(configSection);
            });
            return services;
        }
    }
}
