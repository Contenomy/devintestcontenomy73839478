using Contenomy.Data.Entities;
using JetBrains.Annotations;
using System.Collections;

namespace Contenomy.API.Models
{
	public class UserProfile
	{
        public UserProfile(ContenomyUser? user)
        {
			if (user == null)
			{
				IsAuthenticated = false;
				return;
			}

			IsAuthenticated = true;

			Id = user.Id;
			Name = user.UserName;
			Email = user.Email;
			Phone = user.PhoneNumber;
			Nickname = user.Nickname;
        }

		public bool IsAuthenticated { get; init; }

        public string? Id { get; set; }
		public string? Name { get; set; }
		public string? Email { get; set; }
		public string? Phone { get; set; }
		public string? Nickname { get; set; }
		public IEnumerable<string> Roles { get; set; } = Enumerable.Empty<string>();
		public IDictionary<string, string> Claims { get; set; } = new Dictionary<string, string>();
	}
}
