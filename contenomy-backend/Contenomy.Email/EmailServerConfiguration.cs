using System.Net;
using System.Net.Mail;
using System.Text.Json.Serialization;

namespace Contenomy.Email
{
    internal class EmailServerConfiguration
    {
        public required string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSsl { get; set; } = true;
        public SmtpDeliveryMethod DeliveryMethod { get; set; } = SmtpDeliveryMethod.Network;
        public bool UseDefaultCredentials { get; set; } = false;

        public required string EmailAddress { get; set; }

        public required string Username { get; set; }
        public required string Password { get; set; }

        [JsonIgnore]
        public NetworkCredential Credentials => new(Username, Password);
    }
}
