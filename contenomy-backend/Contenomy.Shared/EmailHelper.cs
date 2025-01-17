using Contenomy.Data.Entities;
using System.Net;
using System.Net.Mail;

namespace Contenomy.API.Shared
{
    public static class EmailHelper
    {
        public static void SendEmail(string to, string subject, string content)
        {
            var config = EmailConfiguration.GetDefault();
            var message = new MailMessage();

            message.To.Add(to);
            message.From = new MailAddress(config.Email);

            message.Subject = subject;
            message.Body = content;

            message.IsBodyHtml = true;

            using var client = new SmtpClient(config.Smtp)
            {
                Credentials = new NetworkCredential(config.Email, config.Password),
                EnableSsl = config.SmtpSSL,
                Port = config.SmtpPort,
                UseDefaultCredentials = false,
            };

            client.Send(message);
        }

        public static void SendVerificationEmail(string to, EmailVerificationRequest request)
        {
            var link = $"https://localhost:7126/api/Account/VerifyEmail?verificationId={request.Id}&requestOn={request.RequestOn:yyyy-MM-ddTHH:mm:ss}&expire={request.ExpiresOn:yyyy-MM-ddTHH:mm:ss}";
            SendEmail(to, "Email verification", $"To verify your email address, please access the following link: <a href=\"{link}\">{link}</a>");
        }
    }

    public class EmailConfiguration
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Smtp { get; set; }
        public int SmtpPort { get; set; }
        public bool SmtpSSL { get; set; }

        public static EmailConfiguration GetDefault()
        {
            return new EmailConfiguration()
            {
                Email = "marco.brandi.ceo@gmail.com",
                SmtpPort = 587,
                SmtpSSL = true,
                Smtp = "smtp.gmail.com",
                Password = "psciuetjkrwhvumr"
            };
        }
    }
}
