using Contenomy.API.Services;
using Contenomy.Shared.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Contenomy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {
        /// <summary>
        /// Gets all active products visible to the public
        /// </summary>
        [HttpGet("products")]
        public async Task<ActionResult<List<ShopProductDTO>>> GetAllProducts()
        {
            try
            {
                var products = await _shopService.GetAllActiveProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return StatusCode(500, "An error occurred while retrieving the products");
            }
        }
        private readonly ShopService _shopService;
        private readonly ILogger<ShopController> _logger;

        public ShopController(ShopService shopService, ILogger<ShopController> logger)
        {
            _shopService = shopService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("products")]
        public async Task<ActionResult<ShopProductDTO>> CreateProduct([FromBody] CreateShopProductDTO dto)
        {
            try
            {
                // Override creatorId with current user's ID
                dto.CreatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(dto.CreatorId))
                {
                    return Unauthorized();
                }

                var product = await _shopService.CreateProductAsync(dto);
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, "An error occurred while creating the product");
            }
        }

        [Authorize]
        [HttpPut("products/{id}")]
        public async Task<ActionResult<ShopProductDTO>> UpdateProduct(int id, [FromBody] UpdateShopProductDTO dto)
        {
            try
            {
                var existingProduct = await _shopService.GetProductByIdAsync(id);
                if (existingProduct == null)
                {
                    return NotFound();
                }

                // Verify user owns this product
                if (existingProduct.CreatorId != User.FindFirst(ClaimTypes.NameIdentifier)?.Value)
                {
                    return Forbid();
                }
                if (existingProduct == null)
                {
                    return NotFound();
                }

                // Only validate non-null values
                if (dto.Name != null && (dto.Name.Length < 3 || dto.Name.Length > 100))
                {
                    return BadRequest("Name must be between 3 and 100 characters");
                }
                if (dto.Description != null && dto.Description.Length > 1000)
                {
                    return BadRequest("Description must not exceed 1000 characters");
                }
                if (dto.Price.HasValue && dto.Price.Value <= 0)
                {
                    return BadRequest("Price must be greater than 0");
                }
                if (dto.ImageUrl != null && (dto.ImageUrl.Length > 500 || !Uri.TryCreate(dto.ImageUrl, UriKind.Absolute, out _)))
                {
                    return BadRequest("Invalid image URL");
                }

                var product = await _shopService.UpdateProductAsync(id, dto);
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {ProductId}", id);
                return StatusCode(500, "An error occurred while updating the product");
            }
        }

        [Authorize]
        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _shopService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Verify user owns this product
            if (product.CreatorId != User.FindFirst(ClaimTypes.NameIdentifier)?.Value)
            {
                return Forbid();
            }

            var result = await _shopService.DeleteProductAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [Authorize]
        [HttpGet("products/creator/{creatorId}")]
        public async Task<ActionResult<List<ShopProductDTO>>> GetProductsByCreator(string creatorId)
        {
            // Verify user has permission to view these products
            if (creatorId != User.FindFirst(ClaimTypes.NameIdentifier)?.Value)
            {
                return Forbid();
            }
        {
            try
            {
                var products = await _shopService.GetProductsByCreatorAsync(creatorId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products for creator {CreatorId}", creatorId);
                return StatusCode(500, "An error occurred while retrieving the products");
            }
        }

        [HttpGet("products/{id}")]
        public async Task<ActionResult<ShopProductDTO>> GetProduct(int id)
        {
            var product = await _shopService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}
