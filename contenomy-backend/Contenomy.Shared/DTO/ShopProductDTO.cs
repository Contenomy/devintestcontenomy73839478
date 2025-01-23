using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Contenomy.Shared.DTO
{
    public class CreateShopProductDTO
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required]
        public string CreatorId { get; set; }

        [StringLength(500)]
        [RegularExpression(@"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$", 
            ErrorMessage = "Please provide a valid URL")]
        public string? ImageUrl { get; set; }

        [StringLength(150)]
        public string? Category { get; set; }
    }

    public class UpdateShopProductDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsActive { get; set; }
        public string? Category { get; set; }
    }

    public class ShopProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string CreatorId { get; set; }
        public string CreatorName { get; set; }
        public bool IsActive { get; set; }
        public string ImageUrl { get; set; }
        public string? Category { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
