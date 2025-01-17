using Newtonsoft.Json;

namespace Contenomy.SocialNetwork.YouTube.Models
{

//	{
//  "kind": "youtube#channelListResponse",
//  "etag": "PCK8-S2LrF5GhZW2qvCLcwdoyDQ",
//  "pageInfo": {
//    "totalResults": 1,
//    "resultsPerPage": 5
//  },
//  "items": [
//    {
//      "kind": "youtube#channel",
//      "etag": "Iqn0sMC68PM9kv9259VL8EwQiZw",
//      "id": "UCzfyYtgvkx5mLy8nlLlayYg",
//      "statistics": {
//        "viewCount": "1429961311",
//        "subscriberCount": "10300000",
//        "hiddenSubscriberCount": false,
//        "videoCount": "274"
//      }
//    }
//  ]
//}

	public class ChannelListResponse
	{
		[JsonProperty("kind")]
		public string Kind { get; set; }

		[JsonProperty("etag")]
		public string Etag { get; set; }

		[JsonProperty("nextPageToken")]
		public string NextPageToken { get; set; }
		[JsonProperty("prevPageToken")]
        public string PrevPageToken { get; set; }

		[JsonProperty("pageInfo")]
        public PageInfo PageInfo { get; set; }

		[JsonProperty("info")]
		public Channel[] Items { get; set; }
	}

	public class Channel
	{
		[JsonProperty("kind")]
		public string Kind { get; set; }

		[JsonProperty("etag")]
		public string Etag { get; set; }

		[JsonProperty("id")]
		public string Id { get; set; }

		[JsonProperty("statistics")]
		public Statistics Statistics { get; set; }
	}

	public class Statistics
	{
		[JsonProperty("viewCount")]
		public ulong ViewCount { get; set; }
		[JsonProperty("subscriberCount")]
		public ulong SubscriberCount { get; set; }
		[JsonProperty("hiddenSubscriberCount")]
		public bool HiddenSubscriberCount { get; set; }
		[JsonProperty("videoCount")]
		public ulong VideoCount { get; set; }
	}

}

