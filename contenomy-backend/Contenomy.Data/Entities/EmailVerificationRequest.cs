using System.ComponentModel.DataAnnotations;

namespace Contenomy.Data.Entities
{
    public class EmailVerificationRequest
    {
        [Key]
        [MaxLength(36)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public required string UserId { get; set; }

        public DateTime RequestOn { get; set; }
        public DateTime ExpiresOn { get; set; }

        public bool Valid { get; set; } = true;

    }
}
