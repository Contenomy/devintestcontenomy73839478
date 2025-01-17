using Contenomy.SocialNetwork.YouTube;

namespace Contenomy.Test.SocialNetwork
{
	[TestClass]
	public class UnitTestYouTube
	{
		YouTubeConnector _connector;

		[TestInitialize]
		public void Initialize()
		{
			_connector = new YouTubeConnector("GoogleDevelopers");
		}

		[TestMethod]
		public void Subscribers()
		{
			try
			{
				var res = _connector.GetFollowersCount().Result;
				Console.WriteLine(res);
				Assert.AreEqual(2_390_000UL, res);
			}
			catch (Exception ex)
			{
				Assert.Fail($"{ex}");
			}
		}

		[TestMethod]
		public void VideoCount()
		{
			try
			{
				var res = _connector.GetPostsCount().Result;
				Console.WriteLine(res);
				Assert.AreEqual(6_279UL, res);
			}
			catch (Exception ex)
			{
				Assert.Fail($"{ex}");
			}
		}

		[TestMethod]
		public void ViewsCount()
		{
			try
			{
				var res = _connector.GetViewsCount().Result;
				Console.WriteLine(res);
				Assert.AreEqual(308_907_134UL, res);
			}
			catch (Exception ex)
			{
				Assert.Fail($"{ex}");
			}
		}
	}
}