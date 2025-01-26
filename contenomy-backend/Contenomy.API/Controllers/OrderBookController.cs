using Contenomy.API.Models.DTO;
using Contenomy.API.Services;
using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Contenomy.API.Controllers
{
	[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderBookController : ControllerBase
    {
        private readonly OrderBookService _orderBookService;
        private readonly ContenomyDbContext _context;
        private readonly UserManager<ContenomyUser> _userManager;

		public OrderBookController(OrderBookService orderBookService, ContenomyDbContext context, UserManager<ContenomyUser> userManager)
		{
			_orderBookService = orderBookService;
			_context = context;
			_userManager = userManager;
		}

		[AllowAnonymous]
        [HttpGet("{creatorAssetId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OrderBookDTO))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetOrderBook(int creatorAssetId)
        {
            var orders = await _orderBookService.GetAllOrdersByCreatorAssetIdAsync(creatorAssetId);

            if (orders.Count <= 0)
            {
                return NotFound();
            }

            var orderBook = new OrderBookDTO
            {
                BuyOrders = orders.Where(o => o.Direction == OrderDirection.Buy)
                    .Select(o => new OrderDTO
                    {
                        Id = o.Id,
                        CreatorAssetId = o.CreatorAssetId,
                        Price = o.Price,
                        Quantity = o.Quantity,
                        Total = o.Price * o.Quantity,
                        UserId = o.UserId
                    }).ToList(),
                SellOrders = orders.Where(o => o.Direction == OrderDirection.Sell)
                    .Select(o => new OrderDTO
                    {
                        Id = o.Id,
                        CreatorAssetId = o.CreatorAssetId,
                        Price = o.Price,
                        Quantity = o.Quantity,
                        Total = o.Price * o.Quantity,
                        UserId = o.UserId
                    }).ToList()
            };

            return Ok(orderBook);
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDTO orderDTO)
        {
            TryValidateModel(orderDTO);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (orderDTO.Price <= 0)
            {
                return BadRequest("Il prezzo dell'ordine deve essere maggiore di zero.");
            }

            var creators = _context.CreatorAssets.Where(ca => ca.CreatorId == orderDTO.CreatorAssetId.ToString());

            var creatorAsset = await _context.CreatorAssets.FirstOrDefaultAsync(ca => ca.Id == orderDTO.CreatorAssetId);
            if (creatorAsset == null)
            {
                return BadRequest("Invalid CreatorAssetId");
            }

            var user = await _userManager.GetUserAsync(User);

            var order = new Order
            {
                CreatorAssetId = creatorAsset.Id,
                /* TIP: NameIdentifier != Id utente. Se serve l'ID dall'utente loggato, prendere tramite UserManager */
                UserId = user?.Id,
                Type = Enum.Parse<OrderType>(orderDTO.Type),
                Direction = Enum.Parse<OrderDirection>(orderDTO.Direction),
                Price = orderDTO.Price,
                Quantity = orderDTO.Quantity,
                CreatedAt = DateTime.UtcNow,
                Status = OrderStatus.Pending
            };

            var placedOrder = await _orderBookService.PlaceOrderAsync(order);
            return CreatedAtAction(nameof(GetOrderBook), new { creatorAssetId = placedOrder.CreatorAssetId }, placedOrder);
        }

        [HttpPost("CancelOrder/{orderId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CancelOrder(int orderId)
		{
			var user = await _userManager.GetUserAsync(User);
			var userId = user?.Id;
            var result = await _orderBookService.CancelOrderAsync(orderId, userId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
