using Newtonsoft.Json;

namespace Contenomy.SocialNetwork.YouTube.Models
{
	public class PageInfo
    {
        [JsonProperty("totalResults")]
        public int TotalResults { get; set; }
        [JsonProperty("resultsPerPage")]
        public int ResultsPerPage { get; set; }
    }
}
