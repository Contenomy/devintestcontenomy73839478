using Contenomy.API.Services;
using Contenomy.Shared.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Contenomy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {
        private readonly ShopService _shopService;
        private readonly ILogger<ShopController> _logger;

        public ShopController(ShopService shopService, ILogger<ShopController> logger)
        {
            _shopService = shopService;
            _logger = logger;
        }

        [HttpPost("products")]
        public async Task<ActionResult<ShopProductDTO>> CreateProduct([FromBody] CreateShopProductDTO dto)
        {
            try
            {
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

        [HttpPut("products/{id}")]
        public async Task<ActionResult<ShopProductDTO>> UpdateProduct(int id, [FromBody] UpdateShopProductDTO dto)
        {
            try
            {
                var product = await _shopService.UpdateProductAsync(id, dto);
                return Ok(product);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {ProductId}", id);
                return StatusCode(500, "An error occurred while updating the product");
            }
        }

        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var result = await _shopService.DeleteProductAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("products/creator/{creatorId}")]
        public async Task<ActionResult<List<ShopProductDTO>>> GetProductsByCreator(string creatorId)
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
