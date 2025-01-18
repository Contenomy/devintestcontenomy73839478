using Contenomy.Data;
using Contenomy.Data.Entities;
using Contenomy.Shared.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Contenomy.API.Services
{
    public class ShopService
    {
        private readonly ContenomyDbContext _context;
        private readonly ILogger<ShopService> _logger;

        public ShopService(ContenomyDbContext context, ILogger<ShopService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ShopProductDTO> CreateProductAsync(CreateShopProductDTO dto)
        {
            // Verify creator exists
            var creator = await _context.Users.FindAsync(dto.CreatorId);
            if (creator == null)
            {
                throw new ArgumentException("Creator not found", nameof(dto.CreatorId));
            }

            var product = new ShopProduct
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                CreatorId = dto.CreatorId,
                ImageUrl = dto.ImageUrl,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ShopProducts.Add(product);
            await _context.SaveChangesAsync();

            return new ShopProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CreatorId = product.CreatorId,
                CreatorName = creator.UserName,
                IsActive = product.IsActive,
                ImageUrl = product.ImageUrl,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }

        public async Task<ShopProductDTO> UpdateProductAsync(int id, UpdateShopProductDTO dto)
        {
            var product = await _context.ShopProducts
                .Include(p => p.Creator)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                throw new ArgumentException("Product not found", nameof(id));
            }

            if (dto.Name != null) product.Name = dto.Name;
            if (dto.Description != null) product.Description = dto.Description;
            if (dto.Price.HasValue) product.Price = dto.Price.Value;
            if (dto.ImageUrl != null) product.ImageUrl = dto.ImageUrl;
            if (dto.IsActive.HasValue) product.IsActive = dto.IsActive.Value;

            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ShopProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CreatorId = product.CreatorId,
                CreatorName = product.Creator.UserName,
                IsActive = product.IsActive,
                ImageUrl = product.ImageUrl,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.ShopProducts.FindAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.ShopProducts.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ShopProductDTO>> GetProductsByCreatorAsync(string creatorId)
        {
            return await _context.ShopProducts
                .Include(p => p.Creator)
                .Where(p => p.CreatorId == creatorId)
                .Select(p => new ShopProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    CreatorId = p.CreatorId,
                    CreatorName = p.Creator.UserName,
                    IsActive = p.IsActive,
                    ImageUrl = p.ImageUrl,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<ShopProductDTO> GetProductByIdAsync(int id)
        {
            var product = await _context.ShopProducts
                .Include(p => p.Creator)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return null;
            }

            return new ShopProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CreatorId = product.CreatorId,
                CreatorName = product.Creator.UserName,
                IsActive = product.IsActive,
                ImageUrl = product.ImageUrl,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }
    }
}
