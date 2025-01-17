namespace Contenomy.SocialNetwork
{
	public abstract class SocialNetworkConnector
	{
		public abstract Task<bool> Login();

		public abstract double GetRating();
		public abstract Task<ulong> GetCommentsCount();
		public abstract Task<ulong> GetLikeCount();
		public abstract Task<ulong> GetFollowersCount();
		public abstract Task<ulong> GetViewsCount();
		public abstract Task<ulong> GetPostsCount();
	}
}