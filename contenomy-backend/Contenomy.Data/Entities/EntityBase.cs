using System.ComponentModel.DataAnnotations;

namespace Contenomy.Data.Entities
{
	public abstract class EntityBase
	{
		[Key]
		public int Id { get; set; }
	}
}
