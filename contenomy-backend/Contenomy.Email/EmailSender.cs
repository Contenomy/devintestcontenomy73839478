using System.Net.Mail;
using System.Security.Cryptography.X509Certificates;

namespace Contenomy.Email
{
    public class EmailSender : IDisposable
    {
        private readonly SmtpClient _smtpClient;
        private readonly string _senderAddress;

        internal EmailSender(EmailServerConfiguration configuration)
        {
            _smtpClient = new SmtpClient()
            {
                Host = configuration.Host,
                Port = configuration.Port,
                UseDefaultCredentials = configuration.UseDefaultCredentials,
                DeliveryMethod = configuration.DeliveryMethod,
                Credentials = configuration.Credentials,
                EnableSsl = configuration.EnableSsl,
            };

            _senderAddress = configuration.EmailAddress;
        }

        private static void AddAllAddresses(IEnumerable<string> addresses, MailAddressCollection collection)
        {
            collection.Clear();
            foreach (var address in addresses)
            {
                collection.Add(address);
            }
        }

        public async Task SendEmail(string subject, string body, IEnumerable<string> to, IEnumerable<string>? toCC, IEnumerable<string>? toBCC)
        {
            ArgumentException.ThrowIfNullOrEmpty(subject, nameof(subject));
            ArgumentException.ThrowIfNullOrEmpty(body, nameof(body));

            if (to == null || !to.Any())
            {
                throw new ArgumentNullException(nameof(to));
            }

            toCC ??= [];
            toBCC ??= [];

            var mail = new MailMessage()
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
                From = new MailAddress(_senderAddress)
            };
            AddAllAddresses(to, mail.To);
            AddAllAddresses(toCC, mail.CC);
            AddAllAddresses(toBCC, mail.Bcc);

            _smtpClient.Send(mail);
        }

        public void Dispose()
        {
            try
            {
                _smtpClient.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {

            }
        }
    }
}
