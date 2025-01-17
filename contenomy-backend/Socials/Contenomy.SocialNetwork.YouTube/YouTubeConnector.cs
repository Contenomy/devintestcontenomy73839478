using Contenomy.SocialNetwork.YouTube.Models;
using Newtonsoft.Json;

namespace Contenomy.SocialNetwork.YouTube
{
	public class YouTubeConnector : SocialNetworkConnector
	{
		private readonly HttpClient _httpClient;

		private const string BASE_URL = "https://www.googleapis.com/youtube/v3/";
		private string API_KEY = "AIzaSyC25amFCwAG195hWO2S_D-tOR7vOVvsJqI";

		private readonly string _user;

		private Channel? _channelInfo;

		public YouTubeConnector(string user)
		{
			_user = user;
			_httpClient = new HttpClient();
		}

		public override Task<ulong> GetCommentsCount()
		{
			throw new NotImplementedException();
		}

		public override Task<ulong> GetLikeCount()
		{
			throw new NotImplementedException();
		}

		public override double GetRating()
		{
			throw new NotImplementedException();
		}

		public override Task<bool> Login()
		{
			return Task.FromResult(true);
		}

		public override async Task<ulong> GetFollowersCount()
		{
			var channel = await GetData();
			return channel.Statistics.SubscriberCount;
		}

		public override async Task<ulong> GetViewsCount()
		{
			var channel = await GetData();
			return channel.Statistics.ViewCount;
		}

		public override async Task<ulong> GetPostsCount()
		{
			var channel = await GetData();
			return channel.Statistics.VideoCount;
		}

		private async Task<Channel> GetData()
		{
			if (_channelInfo != null)
			{
				return _channelInfo;
			}
			var request = new HttpRequestMessage(HttpMethod.Get, $"{BASE_URL}channels?key={API_KEY}&forUsername={_user}&part=statistics");
			var response = await _httpClient.SendAsync(request);

			var resultString = await response.Content.ReadAsStringAsync();

			var responseObject = JsonConvert.DeserializeAnonymousType(resultString, new { items = Array.Empty<Channel>() });

			_channelInfo = responseObject.items[0];

			return _channelInfo!;
		}
	}
}
