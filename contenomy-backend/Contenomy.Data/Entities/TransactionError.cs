using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contenomy.Data.Entities
{
    public class TransactionError : EntityBase
    {
        public int? PurchaseId { get; set; }
        public int? SellId { get; set; }

        public required string Error { get; set; }

        [ForeignKey(nameof(PurchaseId))]
        public Transaction? Purchase { get; set; }

        [ForeignKey(nameof(SellId))]
        public Transaction? Sell { get; set; }

        public string? SerializedException { get; set; }

        [NotMapped]
        public Exception? Exception
        {
            set
            {
                if (value == null) return;

                SerializedException = SerializeException(value);
            }
        }

        [NotMapped]
        public SerializedException? ExceptionData
        {
            get
            {
                if (string.IsNullOrEmpty(SerializedException)) return null;

                return DeserializeException(SerializedException);
            }
        }

        private static string SerializeException(Exception ex)
        {
            return JsonConvert.SerializeObject(new
            {
                ex.Message,
                InnerException = ex.InnerException != null ? SerializeException(ex.InnerException) : null,
                ex.StackTrace,
                ex.Source
            });
        }

        private static SerializedException? DeserializeException(string serializedEx)
        {
            var exData = JsonConvert.DeserializeAnonymousType(serializedEx, new { Message = "", InnerException = "", StackTrace = "", Source = "" });

            if (exData == null)
            {
                return null;
            }

            return new()
            {
                Message = exData.Message,
                Source = exData.Source,
                StackTrace = exData.StackTrace,
                InnerException = !string.IsNullOrEmpty(exData.InnerException) ? DeserializeException(exData.InnerException) : null
            };
        }
    }

    public class SerializedException
    {
        public string? Message { get; internal set; }
        public SerializedException? InnerException { get; internal set; }
        public string? StackTrace { get; internal set; }
        public string? Source { get; internal set; }
    }
}
